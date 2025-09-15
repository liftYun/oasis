package org.muhan.oasis.stay.dto.out;

import org.muhan.oasis.stay.entity.SubRegionEntity;

public record SubRegionResponseDto (
        Long id,
        String subName
){
    public static SubRegionResponseDto from(SubRegionEntity e){
        return new SubRegionResponseDto(
                e.getId(),
                e.getSubName()
        );
    }
}
