package org.muhan.oasis.reservation.vo.in;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.muhan.oasis.stay.entity.StayEntity;
import org.muhan.oasis.user.entity.UserEntity;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class RegistReservationRequestVo {
    private String reservationId;

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
}
