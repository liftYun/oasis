package org.muhan.oasis.review.service;

import org.muhan.oasis.openAI.dto.out.ReviewTranslationResultDto;
import org.muhan.oasis.review.dto.in.RegistReviewRequestDto;
import org.muhan.oasis.review.vo.out.ReviewResponseVo;

import java.util.List;

public interface ReviewService {
    Long registReview(Long userId, RegistReviewRequestDto registReviewRequestDto);

    List<ReviewResponseVo> getListOfReviews(Long userId);

    Long updateReview(Long reviewId, ReviewTranslationResultDto reviewTranslationResultDto);

}
