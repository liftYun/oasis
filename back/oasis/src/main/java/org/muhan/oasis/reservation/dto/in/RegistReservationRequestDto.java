package org.muhan.oasis.reservation.dto.in;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import org.muhan.oasis.reservation.entity.ReservationEntity;
import org.muhan.oasis.reservation.vo.in.RegistReservationRequestVo;
import org.muhan.oasis.stay.entity.StayEntity;
import org.muhan.oasis.user.entity.UserEntity;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
@Builder
public class RegistReservationRequestDto {
    private String reservationId;

    private Long userId;

    private StayEntity stay;

    private LocalDateTime checkinDate;

    private LocalDateTime checkoutDate;

    private LocalDateTime reservationDate;

    private boolean isSettlemented;

    private boolean isReviewed;

    private int payment;

    private boolean isCancled;

    private String stayTitle;

    private String stayTitleEng;

    public static ReservationEntity to(UserEntity user, RegistReservationRequestDto dto) {
        return ReservationEntity.builder()
                .reservationId(dto.getReservationId())
                .user(user)
                .stay(dto.getStay())
                .checkinDate(dto.getCheckinDate())
                .reservationDate(dto.getReservationDate())
                .isSettlemented(dto.isSettlemented())
                .isReviewed(dto.isReviewed())
                .payment(dto.getPayment())
                .isCancled(dto.isCancled())
                .stayTitle(dto.getStayTitle())
                .stayTitleEng(dto.getStayTitleEng())
                .build();
    }

    public static RegistReservationRequestDto from(Long userId, RegistReservationRequestVo vo) {
        return RegistReservationRequestDto.builder()
                .reservationId(vo.getReservationId())
                .userId(userId)
                .stay(vo.getStay())
                .checkinDate(vo.getCheckinDate())
                .reservationDate(vo.getReservationDate())
                .isSettlemented(vo.isSettlemented())
                .isReviewed(vo.isReviewed())
                .payment(vo.getPayment())
                .isCancled(vo.isCancled())
                .stayTitle(vo.getStayTitle())
                .stayTitleEng(vo.getStayTitleEng())
                .build();
    }
}
