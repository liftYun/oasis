package org.muhan.oasis.review.vo.out;

import lombok.Builder;
import lombok.Getter;
import org.muhan.oasis.review.dto.out.ReviewDetailResponseDto;
import org.muhan.oasis.review.entity.ReviewEntity;
import org.muhan.oasis.valueobject.Language;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Builder
public class ReviewDetailResponseVo {
    private Long reviewId;

    private String reservationId;

    private BigDecimal rating;

    private LocalDateTime createdAt;

    private String content;

    public static ReviewDetailResponseVo from(ReviewDetailResponseDto dto) {
        return ReviewDetailResponseVo.builder()
                .reviewId(dto.getReviewId())
                .reservationId(dto.getReservationId())
                .rating(dto.getRating())
                .createdAt(dto.getCreatedAt())
                .content(dto.getContent())
                .build();
    }

    public static ReviewDetailResponseVo fromEntity(ReviewEntity e) {
        Language language = e.getOriginalLang();
        String content;
        if(language.equals(Language.KOR)) content = e.getContent();
        else content = e.getContentEng();

        ReviewDetailResponseDto dto = ReviewDetailResponseDto.builder()
                .reviewId(e.getReviewId())
                .reservationId(
                        e.getReservation() != null && e.getReservation().getReservationId() != null
                                ? e.getReservation().getReservationId()
                                : null
                )
                .rating(e.getRating())
                .createdAt(e.getCreatedAt())
                .content(content)
                .build();

        return ReviewDetailResponseVo.from(dto);
    }

/*
    public static ReviewDetailResponseVo fromEntity(ReviewEntity e, Language language) {
        String content;
        if(language.equals(Language.KOR)){
            content = e.getContent();
            if(content == null) content = e.getContentEng();
        }
        else{
            content = e.getContentEng();
            if(content == null) content = e.getContent();
        }

        ReviewDetailResponseDto dto = ReviewDetailResponseDto.builder()
                .reviewId(e.getReviewId())
                .reservationId(
                        e.getReservation() != null && e.getReservation().getReservationId() != null
                                ? e.getReservation().getReservationId()
                                : null
                )
                .userId(e.getUser() != null ? e.getUser().getUserId() : null)
                .rating(e.getRating())
                .createdAt(e.getCreatedAt())
                .content(content)
                .build();

        return ReviewDetailResponseVo.from(dto);
    }*/
}
