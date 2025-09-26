package org.muhan.oasis.review.dto.out;

import lombok.Builder;
import lombok.Getter;
import org.muhan.oasis.valueobject.Language;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Builder
@Getter
public class ReviewResponseDto {
    private String title;
    private Long reviewId;

    private String reservationId;

    private BigDecimal rating;

    private LocalDateTime createdAt;

    private String thumbnail;
}
