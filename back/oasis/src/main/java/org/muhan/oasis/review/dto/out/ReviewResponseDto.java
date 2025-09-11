package org.muhan.oasis.review.dto.out;

import lombok.Builder;
import lombok.Getter;
import org.muhan.oasis.valueobject.Language;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Builder
@Getter
public class ReviewResponseDto {
    private Long reviewId;

    private String reservationId;

    private Long userId;

    private BigDecimal rating;

    private LocalDateTime createdAt;
}
