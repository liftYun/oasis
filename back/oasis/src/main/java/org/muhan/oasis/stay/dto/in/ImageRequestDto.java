package org.muhan.oasis.stay.dto.in;

import lombok.*;

@Builder
public record ImageRequestDto(Long id, String key, Integer sortOrder){
}
