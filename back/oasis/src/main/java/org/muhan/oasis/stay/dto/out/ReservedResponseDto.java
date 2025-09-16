package org.muhan.oasis.stay.dto.out;

import java.time.LocalDate;

public record ReservedResponseDto(
        LocalDate checkIn,
        LocalDate checkOut
) {
}
