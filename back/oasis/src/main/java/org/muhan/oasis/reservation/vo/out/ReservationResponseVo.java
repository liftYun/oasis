package org.muhan.oasis.reservation.vo.out;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ReservationResponseVo {
    private String reservationId;
    private String approveChallengeId;
    private String lockChallengeId;
}