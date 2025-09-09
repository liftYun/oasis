package org.muhan.oasis.stay.dto.out;

import org.muhan.oasis.stay.entity.FacilityEntity;
import org.muhan.oasis.stay.entity.RegionEntity;
import org.muhan.oasis.stay.entity.StayFacilityEntity;

import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

public record FacilityCategoryResponseDto(
        String category,
        List<FacilityResponseDto> facilities
) {

    public static List<FacilityCategoryResponseDto> from(List<StayFacilityEntity> facilities) {
        if (facilities == null || facilities.isEmpty()) {
            return List.of();
        }

        Map<FacilityEntity, List<FacilityEntity>> grouped = facilities.stream()
                .map(StayFacilityEntity::getFacility)
                .filter(Objects::nonNull)
                .collect(Collectors.groupingBy(
                        FacilityEntity::getCategory,
                        LinkedHashMap::new,
                        Collectors.collectingAndThen(
                                Collectors.toMap(
                                        FacilityEntity::getId,
                                        Function.identity(),
                                        (a, b) -> a,
                                        LinkedHashMap::new
                                ),
                                m -> new ArrayList<>(m.values())
                        )
                ));

        // 2) 카테고리 순서 정렬(ENUM 순서 기준) + 내부 시설 리스트를 DTO로 변환하며 id 기준 정렬
        return grouped.entrySet().stream()
                .map(e -> new FacilityCategoryResponseDto(
                        e.getKey().getName(),
                        e.getValue().stream()
                                .map(FacilityResponseDto::from)
                                // id가 int가 아닌 Long이면 comparingLong(FacilityResponseDto::id)로 변경
                                .sorted(Comparator.comparingLong(FacilityResponseDto::id))
                                .toList()
                ))
                .toList();
    }


}
