package org.muhan.oasis.stay.dto.in;

import lombok.*;

@AllArgsConstructor
@Builder
public record ImageRequestDto(String key, Integer sortOrder){
}
