package org.muhan.oasis.stay.dto.in;

import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public record BlockRangeDto(
        @NotNull LocalDate start,
        @NotNull LocalDate end
) {
}
