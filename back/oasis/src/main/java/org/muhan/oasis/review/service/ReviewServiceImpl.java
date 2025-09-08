package org.muhan.oasis.review.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.muhan.oasis.reservation.entity.ReservationEntity;
import org.muhan.oasis.review.entity.ReviewEntity;
import org.muhan.oasis.review.repository.ReviewRepository;
import org.muhan.oasis.review.vo.in.RegistReviewRequestVo;
import org.muhan.oasis.user.entity.UserEntity;
import org.muhan.oasis.user.repository.UserRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

@Service
@Log4j2
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService{
    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;

    @Override
    public boolean registReview(Long userId, RegistReviewRequestVo registReviewRequestVo) {
        // 1) 예약 존재 확인
        ReservationEntity reservation = reservationRepository.findById(registReviewRequestVo.getReservationId())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 예약입니다."));

        // 2) 예약 소유자(또는 이용자) 검증 — 정책에 맞게 조정
        if (!reservation.getUser().getId().equals(userId)) {
            throw new AccessDeniedException("해당 예약에 대한 리뷰 권한이 없습니다.");
        }

        // 3) 중복 리뷰 방지
        if (reviewRepository.existsByReservation_IdAndUser_Id(reservation.getUserId().getUserId(), userId)) {
            throw new IllegalStateException("이미 해당 예약에 대한 리뷰가 존재합니다.");
        }

        // 4) 작성자, 예약 참조 엔티티 로드
        UserEntity writer = userRepository.getReferenceById(Math.toIntExact(userId));

        // 5) 저장
        ReviewEntity review = ReviewEntity.builder()
                .reservationId(reservation)
                .userId(writer)
                .rating(registReviewRequestVo.getRating())
                .content(registReviewRequestVo.getContent())
                .contentEng(registReviewRequestVo.getContentEng())
                .originalLang(registReviewRequestVo.getOriginalLang())
                .build();

        reviewRepository.save(review);

        // 숙소 평점 집계 업데이트 진행
        // stayService.recalculateRating(reservation.getStay().getId());

        return true;
    }
}
