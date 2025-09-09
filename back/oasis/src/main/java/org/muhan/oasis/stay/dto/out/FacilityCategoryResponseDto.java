package org.muhan.oasis.stay.dto.out;

import java.util.List;

public record FacilityCategoryResponseDto(
        String category,
        List<FacilityResponseDto> facilities
) {
}
