package org.muhan.oasis.stay.dto.out;

import org.muhan.oasis.stay.entity.CancellationPolicyEntity;
import org.muhan.oasis.stay.entity.StayBlockEntity;

import java.time.LocalDate;
import java.util.List;

public record StayBlockResponseDto(
        LocalDate startDate,
        LocalDate endDate
) {
    public static List<StayBlockResponseDto> from(List<StayBlockEntity> blockList) {
        return blockList.stream().map(StayBlockResponseDto::from).toList();
    }

    public static StayBlockResponseDto from(StayBlockEntity block){
        return new StayBlockResponseDto(
                block.getStartDate(),
                block.getEndDate()
        );
    }
}
