package org.muhan.oasis.reservation.dto.in;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import org.muhan.oasis.reservation.entity.ReservationEntity;
import org.muhan.oasis.reservation.enums.ReservationStatus;
import org.muhan.oasis.reservation.vo.in.RegistReservationRequestVo;
import org.muhan.oasis.stay.entity.StayEntity;
import org.muhan.oasis.user.entity.UserEntity;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Objects;

@Getter
@AllArgsConstructor
@Builder
public class RegistReservationRequestDto {

    private static final LocalTime CHECKIN_TIME  = LocalTime.of(9, 0);   // 09:00
    private static final LocalTime CHECKOUT_TIME = LocalTime.of(11, 0);  // 11:00

    private String reservationId;

    private Long stayId;

    private LocalDateTime checkinDate;

    private LocalDateTime checkoutDate;

    private LocalDateTime reservationDate;

    private int payment;

    /**
     * 안전하게 체크인/체크아웃 시간 보정
     */
    private static LocalDateTime normalizeCheckin(LocalDateTime src) {
        if (src == null) return null;
        LocalDate d = src.toLocalDate();
        return LocalDateTime.of(d, CHECKIN_TIME);
    }

    private static LocalDateTime normalizeCheckout(LocalDateTime src) {
        if (src == null) return null;
        LocalDate d = src.toLocalDate();
        return LocalDateTime.of(d, CHECKOUT_TIME);
    }

    public static ReservationEntity to(UserEntity user, StayEntity stay, RegistReservationRequestDto dto, ReservationStatus status) {
        // ✨ 혹시 from()이 아닌 다른 경로로 생성돼도 여기서 한 번 더 보정
        LocalDateTime normalizedCheckin  = normalizeCheckin(dto.getCheckinDate());
        LocalDateTime normalizedCheckout = normalizeCheckout(dto.getCheckoutDate());

        return ReservationEntity.builder()
                .reservationId(dto.getReservationId())
                .user(Objects.requireNonNull(user, "user must not be null"))
                .stay(Objects.requireNonNull(stay, "stay must not be null"))
                .checkinDate(normalizedCheckin)
                .checkoutDate(normalizedCheckout)
                .reservationDate(dto.getReservationDate())
                .isSettlemented(false)
                .isReviewed(false)
                .payment(dto.getPayment())
                .isCanceled(false)
                .stayTitle(stay.getTitle())
                .stayTitleEng(stay.getTitleEng())
                .status(status)
                .build();
    }

    public static RegistReservationRequestDto from(RegistReservationRequestVo vo) {
        // ✨ 여기서 최초로 일괄 보정
        LocalDateTime normalizedCheckin  = normalizeCheckin(vo.getCheckinDate());
        LocalDateTime normalizedCheckout = normalizeCheckout(vo.getCheckoutDate());

        return RegistReservationRequestDto.builder()
                .reservationId(vo.getReservationId())
                .stayId(vo.getStayId())
                .checkinDate(normalizedCheckin)
                .checkoutDate(normalizedCheckout)
                .reservationDate(vo.getReservationDate())
                .payment(vo.getPayment())
                .build();
    }
}
