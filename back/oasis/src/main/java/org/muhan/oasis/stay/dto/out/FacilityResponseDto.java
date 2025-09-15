package org.muhan.oasis.stay.dto.out;

import lombok.Builder;
import org.muhan.oasis.stay.entity.FacilityEntity;

@Builder
public record FacilityResponseDto(Long id, String name) {

    public static FacilityResponseDto from(FacilityEntity facility){
        return FacilityResponseDto.builder()
                .id(facility.getId())
                .name(facility.getName())
                .build();
    }
}
