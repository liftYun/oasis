package org.muhan.oasis.stay.dto.out;

import org.muhan.oasis.stay.entity.RegionEntity;

import java.util.List;

public record RegionResponseDto(
        String region,
        List<SubRegionResponseDto> subRegions
) {

    public static RegionResponseDto from(RegionEntity e){
        List<SubRegionResponseDto> subRegions = e.getSubRegions().stream().map(SubRegionResponseDto::from).toList();
        return new RegionResponseDto(
                e.getName(),
                subRegions
        );
    }

}
