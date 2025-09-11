package org.muhan.oasis.review.dto.out;

import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Builder
@Getter
public class StayReviewResponseDto {
    private Long reviewId;

    private String reservationId;

    private BigDecimal rating;

    private LocalDateTime createdAt;

    private String content;

    private String nickname;
}
