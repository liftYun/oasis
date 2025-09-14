package org.muhan.oasis.reservation.repository;

import java.time.LocalDateTime;

public record ReservationPeriodRow(
        LocalDateTime checkinDate,
        LocalDateTime checkoutDate
) {}