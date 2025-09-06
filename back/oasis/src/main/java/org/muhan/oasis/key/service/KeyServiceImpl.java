package org.muhan.oasis.key.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.muhan.oasis.common.base.BaseResponseStatus;
import org.muhan.oasis.common.exception.BaseException;
import org.muhan.oasis.key.dto.in.RegistKeyRequestDto;
import org.muhan.oasis.key.dto.in.ShareKeyRequestDto;
import org.muhan.oasis.key.entity.KeyEntity;
import org.muhan.oasis.key.entity.KeyOwnerEntity;
import org.muhan.oasis.key.repository.KeyOwnerRepository;
import org.muhan.oasis.key.repository.KeyRepository;
import org.muhan.oasis.key.vo.in.ShareKeyRequestVo;
import org.muhan.oasis.reservation.entity.ReservationEntity;
import org.muhan.oasis.security.repository.UserRepository;
import org.muhan.oasis.stay.entity.DeviceEntity;
import org.muhan.oasis.stay.entity.StayEntity;
import org.muhan.oasis.user.entity.UserEntity;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@Log4j2
@RequiredArgsConstructor
public class KeyServiceImpl implements KeyService {

    private final KeyRepository keyRepository;
    private final KeyOwnerRepository keyOwnerRepository;
    private final ReservationRepository reservationRepository;
    private final DeviceRepository deviceRepository;
    private final UserRepository userRepository;
    private final StringRedisTemplate redis;

    private static final String K_OWNERS  = "key:owners:";
    private static final String K_VALID   = "key:valid:";
    private static final String K_DEVICE  = "key:device:";
    private static final String D_ONLINE  = "device:online:";

    @Override
    public Long registKey(RegistKeyRequestDto registKeyRequestDto) {

        KeyEntity keyEntity = KeyEntity.builder()
                .device(registKeyRequestDto.getDevice())
                .activationTime(registKeyRequestDto.getActivationTime())
                .expirationTime(registKeyRequestDto.getExpireTime())
                .build();
        KeyEntity entity = keyRepository.save(keyEntity);

        return entity.getKeyId();
    }

    @Override
    public Long issueKeysForAllUsers(ShareKeyRequestDto shareKeyRequestDto) {
        // 1. 예약 정보 조회
        ReservationEntity reservation = reservationRepository.findById(shareKeyRequestDto.getReservationId())
                .orElseThrow(() -> new IllegalArgumentException("예약이 존재하지 않습니다."));

        // 2. 예약된 숙소 조회
        StayEntity stay = reservation.getStay();

        // 3. 숙소에 연결된 디바이스 조회
        DeviceEntity device = deviceRepository.findByStayId(stay.getStayId());
        if (device == null) {
            throw new IllegalStateException("해당 숙소에는 도어락이 존재하지 않습니다.");
        }

        // 4. 디바이스에 해당하는 예약에 맞춰 키 발급
        KeyEntity key = KeyEntity.builder()
                .device(device)
                .activationTime(reservation.getCheckinDate().minusMinutes(30)) // 체크인 시간 - 30분
                .expirationTime(reservation.getCheckoutDate().plusMinutes(30)) // 체크아웃 시간 + 30분
                .build();

        KeyEntity saved = keyRepository.save(key);
        log.info("발급된 디지털 키: {}", saved);

        List<String> userNicknames = new ArrayList<>(shareKeyRequestDto.getUserNicknames());
        for (String userNickname : userNicknames) {
            UserEntity user = userRepository.findByNickname(userNickname);

            if (user == null) {
                throw new IllegalStateException(userNickname+" : 해당 유저는 존재하지 않습니다.");
            } else {
                KeyOwnerEntity keyOwner = KeyOwnerEntity.builder()
                        .key(saved)
                        .user(user)
                        .reservation(reservation)
                        .build();
                KeyOwnerEntity savedOwner = keyOwnerRepository.save(keyOwner);
                log.info("공유된 디지털 키: {}", savedOwner);
            }
        }

        Duration ttl = computeTtl(saved.getExpirationTime()); // 게스트 키면 TTL, 마스터키면 null

        // owners (모든 공유 유저 추가)
        for (String userNickname : userNicknames) {
            UserEntity user = userRepository.findByNickname(userNickname);
            redis.opsForSet().add(K_OWNERS + saved.getKeyId(), String.valueOf(user.getUserId()));
        }
        if (ttl != null) redis.expire(K_OWNERS + saved.getKeyId(), ttl);

        // valid
        redis.opsForValue().set(K_VALID + saved.getKeyId(), "1");
        if (ttl != null) redis.expire(K_VALID + saved.getKeyId(), ttl);

        // device
        redis.opsForValue().set(K_DEVICE + saved.getKeyId(), String.valueOf(device.getId()));
        if (ttl != null) redis.expire(K_DEVICE + saved.getKeyId(), ttl);


        return saved.getKeyId();
    }

    @Override
    public String verifyOpenPermission(Long userId, Long keyId) {
        // TODO) 예약 테이블에서 정상적으로 유효한 예약 내역인지 확인

        // 0) 빠른 경로: Redis 조회
        Boolean ownerHit = redis.opsForSet().isMember(K_OWNERS + keyId, String.valueOf(userId));
        String validHit  = redis.opsForValue().get(K_VALID + keyId);
        String deviceIdS = redis.opsForValue().get(K_DEVICE + keyId);

        if (Boolean.TRUE.equals(ownerHit) && "1".equals(validHit) && deviceIdS != null) {
            // 디바이스 온라인 즉시 확인
            ensureDeviceOnline(deviceIdS);
            return topicFor(deviceIdS);
        }

        // 1) 레디스에 문제가 있는것 같으면 DB로 검증
        KeyOwnerEntity owner = keyOwnerRepository
                .findByUser_UserIdAndKey_KeyId(userId, keyId)
                .orElseThrow(() -> new BaseException(BaseResponseStatus.NO_ACCESS_AUTHORITY));

        KeyEntity key = keyRepository.findById(keyId)
                .orElseThrow(() -> new BaseException(BaseResponseStatus.NO_EXIST_KEY));

        if (!key.isValidNow()) {
            throw new BaseException(BaseResponseStatus.KEY_NOT_VALID);
        }

        // 2) 디바이스 온라인 체크 (Redis heartbeat)
        Long deviceId = key.getDevice().getId();
        ensureDeviceOnline(String.valueOf(deviceId));

        // 3) Redis 갱신(리필) — TTL은 만료시각 기준으로 계산
        Duration ttl = computeTtl(key.getExpirationTime()); // 만료없으면 null
        // owners
        redis.opsForSet().add(K_OWNERS + keyId, String.valueOf(owner.getUser().getUserId()));
        if (ttl != null) redis.expire(K_OWNERS + keyId, ttl);
        // valid
        redis.opsForValue().set(K_VALID + keyId, "1");
        if (ttl != null) redis.expire(K_VALID + keyId, ttl);
        // device
        redis.opsForValue().set(K_DEVICE + keyId, String.valueOf(deviceId));
        if (ttl != null) redis.expire(K_DEVICE + keyId, ttl);

        // 4) 토픽 반환
        return topicFor(String.valueOf(deviceId));
    }

    private void ensureDeviceOnline(String deviceIdS) {
        String online = redis.opsForValue().get(D_ONLINE + deviceIdS);
        // 온라인 키가 없거나 1이 아니면 오프라인으로 간주
        if (!"1".equals(online)) {
            throw new BaseException(BaseResponseStatus.DEVICE_OFFLINE);
        }
    }

    private String topicFor(String deviceIdS) {
        // 예: device/{deviceId}/open
        return "device/" + deviceIdS + "/open";
    }

    private Duration computeTtl(LocalDateTime expirationTime) {
        if (expirationTime == null) return null; // 마스터 키 → TTL 부여 안 함(정책에 따라 부여해도 OK)
        LocalDateTime now = LocalDateTime.now();
        if (expirationTime.isBefore(now)) return Duration.ZERO;
        return Duration.between(now, expirationTime);
    }

    // 체크아웃 등 키 만료 시 레디스에서 지우기
    public void revokeKey(Long keyId) {
        redis.delete(K_OWNERS + keyId);
        redis.delete(K_VALID + keyId);
        redis.delete(K_DEVICE + keyId);
    }


}
