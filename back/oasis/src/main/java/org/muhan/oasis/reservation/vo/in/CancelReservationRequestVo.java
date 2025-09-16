package org.muhan.oasis.reservation.vo.in;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.UUID;

@Getter
@AllArgsConstructor
public class CancelReservationRequestVo {
    UUID idempotencyKey;
}
