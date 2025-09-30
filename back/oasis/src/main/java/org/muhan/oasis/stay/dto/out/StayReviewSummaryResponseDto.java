package org.muhan.oasis.stay.dto.out;

import lombok.Builder;
import org.muhan.oasis.stay.entity.StayRatingSummaryEntity;
import org.muhan.oasis.valueobject.Language;

import java.math.BigDecimal;

@Builder
public record StayReviewSummaryResponseDto(
        BigDecimal rating,
        Integer count,
        String highRateSummary,
        String lowRateSummary
){
    public static StayReviewSummaryResponseDto from(StayRatingSummaryEntity summaryEntity, Language language) {
        return StayReviewSummaryResponseDto.builder()
                .rating(summaryEntity.getAvgRating())
                .count(summaryEntity.getRatingCnt())
                .highRateSummary(language.equals(Language.KOR)?summaryEntity.getHighRateSummary():summaryEntity.getHighRateSummaryEng())
                .lowRateSummary(language.equals(Language.KOR)?summaryEntity.getLowRateSummary(): summaryEntity.getLowRateSummaryEng())
                .build();
    }

}
