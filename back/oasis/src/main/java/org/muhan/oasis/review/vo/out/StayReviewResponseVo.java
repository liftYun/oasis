package org.muhan.oasis.review.vo.out;

import lombok.Builder;
import lombok.Getter;
import org.muhan.oasis.review.dto.out.ReviewDetailResponseDto;
import org.muhan.oasis.review.dto.out.StayReviewResponseDto;
import org.muhan.oasis.review.entity.ReviewEntity;
import org.muhan.oasis.valueobject.Language;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Builder
public class StayReviewResponseVo {
    private Long reviewId;

    private String reservationId;

    private BigDecimal rating;

    private LocalDateTime createdAt;

    private String content;

    private String nickname;

    public static StayReviewResponseVo from(StayReviewResponseDto dto) {
        return StayReviewResponseVo.builder()
                .reviewId(dto.getReviewId())
                .reservationId(dto.getReservationId())
                .rating(dto.getRating())
                .createdAt(dto.getCreatedAt())
                .content(dto.getContent())
                .nickname(dto.getNickname())
                .build();
    }

    public static StayReviewResponseVo fromEntity(ReviewEntity e, Language language, String nickname) {
        String content;
        if(language.equals(Language.KOR)){
            content = e.getContent();
            if(content == null) content = e.getContentEng();
        }
        else{
            content = e.getContentEng();
            if(content == null) content = e.getContent();
        }

        StayReviewResponseDto dto = StayReviewResponseDto.builder()
                .reviewId(e.getReviewId())
                .reservationId(
                        e.getReservation() != null && e.getReservation().getReservationId() != null
                                ? e.getReservation().getReservationId()
                                : null
                )
                .nickname(nickname)
                .rating(e.getRating())
                .createdAt(e.getCreatedAt())
                .content(content)
                .build();

        return StayReviewResponseVo.from(dto);
    }
}
