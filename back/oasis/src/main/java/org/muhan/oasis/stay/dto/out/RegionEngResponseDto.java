package org.muhan.oasis.stay.dto.out;

import org.muhan.oasis.stay.entity.RegionEngEntity;
import org.muhan.oasis.stay.entity.RegionEntity;

import java.util.List;

public record RegionEngResponseDto(
        String region,
        List<SubRegionEngResponseDto> subRegions
) {

    public static RegionEngResponseDto from(RegionEngEntity e){
        List<SubRegionEngResponseDto> subRegions = e.getSubRegionsEng().stream().map(SubRegionEngResponseDto::from).toList();
        return new RegionEngResponseDto(
                e.getName(),
                subRegions
        );
    }

}
