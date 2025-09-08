package org.muhan.oasis.review.service;

import org.muhan.oasis.review.dto.in.RegistReviewRequestDto;

public interface ReviewService {
    boolean registReview(Long userId, RegistReviewRequestDto registReviewRequestDto);
}
