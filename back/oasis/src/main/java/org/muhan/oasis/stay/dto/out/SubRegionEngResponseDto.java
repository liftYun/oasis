package org.muhan.oasis.stay.dto.out;

import org.muhan.oasis.stay.entity.SubRegionEngEntity;

public record SubRegionEngResponseDto(
        Long id,
        String subName
){
    public static SubRegionEngResponseDto from(SubRegionEngEntity e){
        return new SubRegionEngResponseDto(
                e.getId(),
                e.getSubName()
        );
    }
}
