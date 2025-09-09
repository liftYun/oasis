package org.muhan.oasis.stay.dto.out;

import org.muhan.oasis.stay.entity.FacilityEntity;
import org.muhan.oasis.stay.entity.StayFacilityEntity;
import org.muhan.oasis.valueobject.Category;

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

        Map<Category, List<FacilityEntity>> grouped = facilities.stream()
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

        return grouped.entrySet().stream()
                .map(e -> new FacilityCategoryResponseDto(
                        e.getKey().name(),
                        e.getValue().stream()
                                .map(FacilityResponseDto::from)
                                .sorted(Comparator.comparingLong(FacilityResponseDto::id))
                                .toList()
                ))
                .toList();
    }


}
