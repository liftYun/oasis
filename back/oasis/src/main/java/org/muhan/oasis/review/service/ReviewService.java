package org.muhan.oasis.review.service;

import org.muhan.oasis.review.vo.in.RegistReviewRequestVo;

public interface ReviewService {
    boolean registReview(Long userId, RegistReviewRequestVo registReviewRequestVo);
}
