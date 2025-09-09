package org.muhan.oasis.review.dto.in;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class RegistReviewRequestDto {
    private Long reservationId;

    private float rating;

    private String originalContent;
}
