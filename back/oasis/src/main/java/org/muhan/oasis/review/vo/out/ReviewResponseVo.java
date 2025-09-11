package org.muhan.oasis.review.vo.out;

import lombok.Builder;
import lombok.Getter;
import org.muhan.oasis.review.dto.out.ReviewResponseDto;
import org.muhan.oasis.review.entity.ReviewEntity;
import org.muhan.oasis.valueobject.Language;

import java.math.BigDecimal;
import java.time.LocalDateTime;
@Getter
@Builder
public class ReviewResponseVo {
    private Long reviewId;

    private String reservationId;

    private Long userId;

    private BigDecimal rating;

    private LocalDateTime createdAt;


    public static ReviewResponseVo from(ReviewResponseDto dto) {
        return org.muhan.oasis.review.vo.out.ReviewResponseVo.builder()
                .reviewId(dto.getReviewId())
                .reservationId(dto.getReservationId())
                .userId(dto.getUserId())
                .rating(dto.getRating())
                .createdAt(dto.getCreatedAt())
                .build();
    }

    public static ReviewResponseVo fromEntity(ReviewEntity e) {
        ReviewResponseDto dto = ReviewResponseDto.builder()
                .reviewId(e.getReviewId())
                .reservationId(
                        e.getReservation() != null && e.getReservation().getReservationId() != null
                                ? e.getReservation().getReservationId()
                                : null
                )
                .userId(e.getUser() != null ? e.getUser().getUserId() : null)
                .rating(e.getRating())
                .createdAt(e.getCreatedAt())
                .build();

        return ReviewResponseVo.from(dto);
    }
}
