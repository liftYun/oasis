package org.muhan.oasis.stay.dto.out;

import lombok.Builder;
import org.muhan.oasis.stay.entity.StayRatingSummaryEntity;

import java.math.BigDecimal;

@Builder
public record StayReviewResponseDto(
        BigDecimal rating,
        Integer count,
        String highRateSummary,
        String lowRateSummary
){
    public static StayReviewResponseDto from(StayRatingSummaryEntity summaryEntity) {
        return StayReviewResponseDto.builder()
                .rating(summaryEntity.getAvgRating())
                .count(summaryEntity.getRatingCnt())
                .highRateSummary(summaryEntity.getHighRateSummary())
                .lowRateSummary(summaryEntity.getLowRateSummary())
                .build();
    }

}
