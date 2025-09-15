package org.muhan.oasis.reservation.vo.in;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class RegistReservationRequestVo {
    private String reservationId;

    private Long stayId;

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
