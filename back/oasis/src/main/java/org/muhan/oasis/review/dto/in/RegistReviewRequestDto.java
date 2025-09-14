package org.muhan.oasis.review.dto.in;

import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;

@Getter
@Builder
public class RegistReviewRequestDto {
    private String reservationId;

    private BigDecimal rating;

    private String originalContent;
}
