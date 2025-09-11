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
import org.muhan.oasis.reservation.entity.ReservationEntity;
import org.muhan.oasis.reservation.repository.ReservationRepository;
import org.muhan.oasis.stay.repository.DeviceRepository;
import org.muhan.oasis.user.repository.UserRepository;
import org.muhan.oasis.stay.entity.DeviceEntity;
import org.muhan.oasis.stay.entity.StayEntity;
import org.muhan.oasis.user.entity.UserEntity;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

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
        // 1) 예약 조회
        ReservationEntity reservation = reservationRepository.findById(Long.valueOf(shareKeyRequestDto.getReservationId()))
                .orElseThrow(() -> new IllegalArgumentException("예약이 존재하지 않습니다."));

        // 2) 숙소/디바이스
        StayEntity stay = reservation.getStay();
        DeviceEntity device = deviceRepository.findByStayId(stay.getId());
        if (device == null) throw new IllegalStateException("해당 숙소에는 도어락이 존재하지 않습니다.");

        // 3) 키 생성
        KeyEntity saved = keyRepository.save(
                KeyEntity.builder()
                        .device(device)
                        .activationTime(reservation.getCheckinDate().minusMinutes(30))
                        .expirationTime(reservation.getCheckoutDate().plusMinutes(30))
                        .build()
        );
        log.info("발급된 디지털 키: {}", saved);

        // 닉네임 중복 제거
        List<String> nicknames = shareKeyRequestDto.getUserNicknames().stream()
                .map(String::trim)
                .filter(s -> !s.isBlank())
                .distinct()
                .toList();

        // 한 번에 사용자 조회
        List<UserEntity> users = userRepository.findAllByNicknameIn(nicknames);

        // 누락 닉네임 검증
        var foundNickSet = users.stream().map(UserEntity::getNickname).collect(java.util.stream.Collectors.toSet());
        List<String> missing = nicknames.stream().filter(n -> !foundNickSet.contains(n)).toList();
        if (!missing.isEmpty()) {
            throw new IllegalStateException("존재하지 않는 유저 닉네임: " + String.join(", ", missing));
        }

        // KeyOwner 저장 + Redis 추가를 한 번에
        for (UserEntity user : users) {
            // 중복 소유 방지
            boolean exists = keyOwnerRepository.existsByKey_KeyIdAndUser_UserId(saved.getKeyId(), user.getUserId());
            if (!exists) {
                KeyOwnerEntity owner = KeyOwnerEntity.builder()
                        .key(saved)
                        .user(user)
                        .reservation(reservation)
                        .build();
                keyOwnerRepository.save(owner);
                log.info("공유된 디지털 키: keyId={}, userId={}", saved.getKeyId(), user.getUserId());
            }

            // Redis owners 세트에 추가
            redis.opsForSet().add(K_OWNERS + saved.getKeyId(), String.valueOf(user.getUserId()));
        }

        // TTL/valid/device 캐시
        Duration ttl = computeTtl(saved.getExpirationTime());
        if (ttl != null) redis.expire(K_OWNERS + saved.getKeyId(), ttl);

        redis.opsForValue().set(K_VALID + saved.getKeyId(), "1");
        if (ttl != null) redis.expire(K_VALID + saved.getKeyId(), ttl);

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
