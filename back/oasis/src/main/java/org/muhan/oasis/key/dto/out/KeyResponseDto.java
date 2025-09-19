package org.muhan.oasis.key.dto.out;

import jakarta.persistence.Column;
import lombok.*;
import org.muhan.oasis.key.entity.KeyEntity;
import org.muhan.oasis.key.entity.KeyOwnerEntity;
import org.muhan.oasis.reservation.entity.ReservationEntity;
import org.muhan.oasis.stay.entity.DeviceEntity;

import java.time.LocalDateTime;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class KeyResponseDto {

    /** ====== 식별/연결 ====== */
    private Long keyId;           // 디지털 키 PK
    private Long deviceId;        // 도어락/디바이스 PK
    private Long stayId;          // 숙소 PK
    private String reservationId; // 예약 ID (게스트-키의 귀속 확인용)

    /** ====== 표시용(다국어) ====== */
    private String stayName;      // 카드 타이틀 (국문)
    private String stayNameEng;   // 카드 타이틀 (영문)

    /** ====== 숙소 주소(다국어) ====== */
    private String addressLine;
    private String addressLineEng;

    /** ====== 썸네일/뷰 용 ====== */
    private String thumbnailUrl;  // 숙소 썸네일 (ReservationEntity.getStay().getThumbnail())

    /** ====== 이용 가능 시간 ====== */
    private LocalDateTime activationTime; // 키 활성(발급) 시각
    private LocalDateTime expirationTime; // 만료 시각
    private KeyStatus status;             // UPCOMING / ACTIVE / EXPIRED

    /** ====== 일정(목록 카드에 보이는 범위) ====== */
    private LocalDateTime checkinDate;
    private LocalDateTime checkoutDate;

    /**
     * KeyOwnerEntity(게스트-키 매핑)에서 목록 카드에 필요한 필드만 추출
     * - 쿼리 시 key->device->stay, reservation 을 fetch join 하면 N+1 방지 가능
     */
    public static KeyResponseDto from(KeyOwnerEntity keyOwner) {
        KeyEntity key = keyOwner.getKey();
        DeviceEntity device = key.getDevice();
        var stay = device.getStay();
        ReservationEntity res = keyOwner.getReservation();

        LocalDateTime now = LocalDateTime.now();
        KeyStatus status = KeyStatus.of(key.getActivationTime(), key.getExpirationTime(), now);

        return KeyResponseDto.builder()
                .keyId(key.getKeyId())
                .deviceId(device.getId())
                .stayId(stay.getId())
                .reservationId(res != null ? res.getReservationId() : null)

                // 표시용 이름(다국어)
                .stayName(device.getStayName())
                .stayNameEng(device.getStayNameEng())

                // 주소(다국어) - 주소는 숙소 기준으로 매핑
                .addressLine(stay.getAddressLine())
                .addressLineEng(stay.getAddressLineEng())

                // 썸네일: 예약에 썸네일이 있으면 우선 사용, 없으면 숙소 썸네일
                .thumbnailUrl(res != null && res.getThumbnail() != null ? res.getThumbnail() : stay.getThumbnail())

                // 키 상태/시간
                .activationTime(key.getActivationTime())
                .expirationTime(key.getExpirationTime())
                .status(status)

                // 체크인/아웃(예약이 있을 때만)
                .checkinDate(res != null ? res.getCheckinDate() : null)
                .checkoutDate(res != null ? res.getCheckoutDate() : null)
                .build();
    }

    @Getter
    @AllArgsConstructor
    public enum KeyStatus {
        UPCOMING,   // activationTime > now
        ACTIVE,     // activationTime <= now <= expirationTime (또는 만료 미설정)
        EXPIRED;    // expirationTime < now

        public static KeyStatus of(LocalDateTime activation, LocalDateTime expiration, LocalDateTime now) {
            if (activation != null && now.isBefore(activation)) return UPCOMING;
            if (expiration != null && now.isAfter(expiration)) return EXPIRED;
            return ACTIVE;
        }
    }
}
