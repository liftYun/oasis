package org.muhan.oasis.review.vo.in;

import jakarta.validation.constraints.*;
import lombok.Builder;
import lombok.Getter;
import org.muhan.oasis.key.dto.in.RegistKeyRequestDto;
import org.muhan.oasis.review.dto.in.RegistReviewRequestDto;
import org.muhan.oasis.security.dto.in.RegistRequestDto;
import org.muhan.oasis.valueobject.Language;

import java.math.BigDecimal;

@Getter
@Builder
public class RegistReviewRequestVo {
    @NotNull(message = "예약 ID는 필수입니다.")
    private Long reservationId;

    @NotNull(message = "별점은 필수입니다.")
    @DecimalMin(value = "0.5", message = "별점은 최소 0.5 이상이어야 합니다.")
    @DecimalMax(value = "5.0", message = "별점은 최대 5.0 이하여야 합니다.")
    private BigDecimal rating;

    @Size(max = 2000, message = "내용은 2000자 이하여야 합니다.")
    private String originalContent;

    public RegistReviewRequestDto toDto() {
        return RegistReviewRequestDto.builder()
                .reservationId(this.reservationId)
                .rating(this.rating)
                .originalContent(this.originalContent)
                .build();
    }
}
