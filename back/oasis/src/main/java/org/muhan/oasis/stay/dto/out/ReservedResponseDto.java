package org.muhan.oasis.stay.dto.out;

import java.time.LocalDateTime;

public record ReservedResponseDto(
        LocalDateTime checkIn,
        LocalDateTime checkOut
) {
}
