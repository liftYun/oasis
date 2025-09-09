package org.muhan.oasis.stay.dto.out;

import lombok.AllArgsConstructor;
import lombok.Builder;

@AllArgsConstructor
@Builder
public record StayCreateResponseDto(Long stayId) {
}
