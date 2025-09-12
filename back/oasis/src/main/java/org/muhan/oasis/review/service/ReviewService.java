package org.muhan.oasis.review.service;

import org.muhan.oasis.openAI.dto.out.ReviewTranslationResultDto;
import org.muhan.oasis.review.dto.in.RegistReviewRequestDto;
import org.muhan.oasis.review.vo.out.ReviewDetailResponseVo;
import org.muhan.oasis.review.vo.out.ReviewResponseVo;
import org.muhan.oasis.review.vo.out.StayReviewResponseVo;

import java.util.List;

public interface ReviewService {
    Long registReview(Long userId, RegistReviewRequestDto registReviewRequestDto);

    List<ReviewResponseVo> getListOfReviews(Long userId);

    Long updateReview(Long reviewId, ReviewTranslationResultDto reviewTranslationResultDto);

    ReviewDetailResponseVo getReviewDetail(Long userId, Long reviewId);

    List<StayReviewResponseVo> getStayReview(Long userId, Long stayId);
}
