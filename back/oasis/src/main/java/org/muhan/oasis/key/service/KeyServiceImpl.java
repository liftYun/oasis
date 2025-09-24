package org.muhan.oasis.key.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.muhan.oasis.common.base.BaseResponseStatus;
import org.muhan.oasis.common.exception.BaseException;
import org.muhan.oasis.key.dto.in.RegistKeyRequestDto;
import org.muhan.oasis.key.dto.in.ShareKeyRequestDto;
import org.muhan.oasis.key.dto.out.KeyResponseDto;
import org.muhan.oasis.key.entity.KeyEntity;
import org.muhan.oasis.key.entity.KeyOwnerEntity;
import org.muhan.oasis.key.repository.KeyOwnerRepository;
import org.muhan.oasis.key.repository.KeyRepository;
import org.muhan.oasis.mqtt.service.DeviceStatusService;
import org.muhan.oasis.reservation.entity.ReservationEntity;
import org.muhan.oasis.reservation.repository.ReservationRepository;
import org.muhan.oasis.stay.repository.DeviceRepository;
import org.muhan.oasis.user.repository.UserRepository;
import org.muhan.oasis.stay.entity.DeviceEntity;
import org.muhan.oasis.stay.entity.StayEntity;
import org.muhan.oasis.user.entity.UserEntity;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

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
    private final DeviceStatusService deviceStatusService;

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
    @Transactional
    public Long issueKeysForAllUsers(ShareKeyRequestDto shareKeyRequestDto) {
        // 1) 예약 조회
        ReservationEntity reservation = reservationRepository.findById(shareKeyRequestDto.getReservationId())
                .orElseThrow(() -> new IllegalArgumentException("예약이 존재하지 않습니다."));

        // 2) 숙소/디바이스
        StayEntity stay = reservation.getStay();

        // devices의 PK는 stay_id(= @MapsId)이므로 보통 findById(stayId) 형태가 자연스럽습니다.
        // 현재 사용하시는 findByStayId(...)가 있다면 그대로 사용해도 됩니다.
        DeviceEntity device = deviceRepository.findById(stay.getId())
                .orElseGet(() -> deviceRepository.findByStayId(stay.getId())); // 둘 중 제공되는 쪽 사용
        if (device == null) throw new IllegalStateException("해당 숙소에는 도어락이 존재하지 않습니다.");

        // 3) 키 생성 (device_id까지 채움)
        KeyEntity saved = keyRepository.save(
                KeyEntity.builder()
                        .device(device)                                    // stay_id 채움
                        .deviceId(device.getDeviceId())                    // device_id 채움 (NOT NULL 대응)
                        .activationTime(reservation.getCheckinDate().minusMinutes(30))
                        .expirationTime(reservation.getCheckoutDate().plusMinutes(30))
                        .build()
        );
        log.info("발급된 디지털 키: keyId={}, stayId={}, deviceId={}",
                saved.getKeyId(), device.getId(), device.getDeviceId());

        // 닉네임 정제
        List<String> nicknames = shareKeyRequestDto.getUserNicknames().stream()
                .map(String::trim)
                .filter(s -> !s.isBlank())
                .distinct()
                .toList();

        // 사용자 일괄 조회 및 검증
        List<UserEntity> users = userRepository.findAllByNicknameIn(nicknames);
        var foundNickSet = users.stream().map(UserEntity::getNickname).collect(Collectors.toSet());
        List<String> missing = nicknames.stream().filter(n -> !foundNickSet.contains(n)).toList();
        if (!missing.isEmpty()) {
            throw new IllegalStateException("존재하지 않는 유저 닉네임: " + String.join(", ", missing));
        }

        // KeyOwner 저장
        for (UserEntity user : users) {
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
        }

        return saved.getKeyId();
    }



    @Override
    public String verifyOpenPermission(Long userId, Long keyId) {

        // 1. 사용자 권한 확인
        KeyOwnerEntity owner = keyOwnerRepository
                .findByUser_UserIdAndKey_KeyId(userId, keyId)
                .orElseThrow(() -> {
                    log.warn("[KEY] 권한 없음 - userId: {}, keyId: {}", userId, keyId);
                    return new BaseException(BaseResponseStatus.NO_ACCESS_AUTHORITY);
                });

        // 2. 키 만료 시간 검증
        KeyEntity key = owner.getKey();
        if (!key.isValidNow()) {
            log.warn("[KEY] 키 만료됨 - keyId: {}, activationTime: {}, expirationTime: {}",
                    keyId, key.getActivationTime(), key.getExpirationTime());
            throw new BaseException(BaseResponseStatus.KEY_NOT_VALID);
        }

        // 3. 디바이스 온라인 상태 확인
        DeviceEntity device = key.getDevice();
        String deviceId = String.valueOf(device.getId());

        if (!deviceStatusService.isDeviceOnline(deviceId)) {
            log.warn("[KEY] 디바이스 오프라인 - deviceId: {}", deviceId);
            throw new BaseException(BaseResponseStatus.DEVICE_OFFLINE);
        }

        log.info("[KEY] 권한 검증 성공 - keyId: {}, deviceId: {}", keyId, deviceId);

        // 4. Arduino 코드에 맞는 토픽 반환 (cmd/{deviceId}/open)
        return topicFor(String.valueOf(deviceId));
    }

    /**
     * 게스트가 보유한 '만료되지 않은' 키 목록(UPCOMING/ACTIVE)을 조회
     * - KeyOwner → Key → Device → Stay, (+) Reservation 을 fetch join 하여 N+1 방지
     * - DTO 매핑은 KeyResponseDto.from(...) 사용
     */
    @Override
    public List<KeyResponseDto> listKeysForGuest(Long userId) {
        LocalDateTime now = LocalDateTime.now();
        List<KeyOwnerEntity> owners = keyOwnerRepository.findActiveKeysForGuest(userId, now);

        return owners.stream()
                .map(KeyResponseDto::from)
                .toList();
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
        return "cmd/" + deviceIdS + "/open";
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
