package org.muhan.oasis.review.dto.out;

import lombok.Builder;
import lombok.Getter;
import org.muhan.oasis.valueobject.Language;

import java.time.LocalDateTime;

@Builder
@Getter
public class ReviewResponseDto {
    private Long reviewId;

    private String reservationId;

    private Long userId;

    private float rating;

    private LocalDateTime createdAt;
}
