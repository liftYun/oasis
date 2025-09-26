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
    private String title;

    private Long reviewId;

    private String reservationId;

    private BigDecimal rating;

    private LocalDateTime createdAt;

    private String thumbnail;

    public static ReviewResponseVo from(ReviewResponseDto dto) {
        return ReviewResponseVo.builder()
                .title(dto.getTitle())
                .reviewId(dto.getReviewId())
                .reservationId(dto.getReservationId())
                .rating(dto.getRating())
                .createdAt(dto.getCreatedAt())
                .thumbnail(dto.getThumbnail())
                .build();
    }

    public static ReviewResponseVo fromEntity(ReviewEntity e, Language language) {

        String title;
        if(language.equals(Language.KOR)) {
            title = e.getReservation().getStayTitle();
        }
        else {
            title = e.getReservation().getStayTitleEng();
        }

        ReviewResponseDto dto = ReviewResponseDto.builder()
                .title(title)
                .reviewId(e.getReviewId())
                .reservationId(
                        e.getReservation() != null && e.getReservation().getReservationId() != null
                                ? e.getReservation().getReservationId()
                                : null
                )
                .rating(e.getRating())
                .createdAt(e.getCreatedAt())
                .thumbnail(e.getThumbnail())
                .build();

        return ReviewResponseVo.from(dto);
    }
}
