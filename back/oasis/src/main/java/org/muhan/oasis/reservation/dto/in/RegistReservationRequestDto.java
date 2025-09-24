package org.muhan.oasis.reservation.dto.in;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import org.muhan.oasis.reservation.entity.ReservationEntity;
import org.muhan.oasis.reservation.enums.ReservationStatus;
import org.muhan.oasis.reservation.vo.in.RegistReservationRequestVo;
import org.muhan.oasis.stay.entity.StayEntity;
import org.muhan.oasis.user.entity.UserEntity;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
@Builder
public class RegistReservationRequestDto {
    private String reservationId;

    private Long stayId;

    private LocalDateTime checkinDate;

    private LocalDateTime checkoutDate;

    private LocalDateTime reservationDate;

    private int payment;

    public static ReservationEntity to(UserEntity user, StayEntity stay, RegistReservationRequestDto dto, ReservationStatus status) {
        return ReservationEntity.builder()
                .reservationId(dto.getReservationId())
                .user(user)
                .stay(stay)
                .checkinDate(dto.getCheckinDate())
                .checkoutDate(dto.getCheckoutDate())
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
        return RegistReservationRequestDto.builder()
                .reservationId(vo.getReservationId())
                .stayId(vo.getStayId())
                .checkinDate(vo.getCheckinDate())
                .checkoutDate(vo.getCheckoutDate())
                .reservationDate(vo.getReservationDate())
                .payment(vo.getPayment())
                .build();
    }
}
