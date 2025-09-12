package org.muhan.oasis.review.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

import org.muhan.oasis.common.base.BaseResponseStatus;
import org.muhan.oasis.common.exception.BaseException;
import org.muhan.oasis.openAI.dto.in.ReviewRequestDto;
import org.muhan.oasis.openAI.dto.out.ReviewTranslationResultDto;
import org.muhan.oasis.openAI.service.SqsSendService;
import org.muhan.oasis.reservation.entity.ReservationEntity;
import org.muhan.oasis.reservation.repository.ReservationRepository;
import org.muhan.oasis.review.dto.in.RegistReviewRequestDto;
import org.muhan.oasis.review.entity.ReviewEntity;
import org.muhan.oasis.review.repository.ReviewRepository;
import org.muhan.oasis.review.vo.out.ReviewDetailResponseVo;
import org.muhan.oasis.review.vo.out.ReviewResponseVo;
import org.muhan.oasis.review.vo.out.StayReviewResponseVo;
import org.muhan.oasis.stay.service.StayService;
import org.muhan.oasis.user.entity.UserEntity;
import org.muhan.oasis.user.repository.UserRepository;
import org.muhan.oasis.valueobject.Language;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.function.Supplier;

@Service
@Log4j2
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService{
    private final ReservationRepository reservationRepository;
    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;
    private final StayService stayService;
    private SqsSendService sqsSendService;

    @Override
    public Long registReview(Long userId, RegistReviewRequestDto registReviewRequestDto) {
        // 1) 예약 존재 확인
        ReservationEntity reservation = reservationRepository.findById(registReviewRequestDto.getReservationId())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 예약입니다."));

        // 2) 예약 소유자(또는 이용자) 검증 — 정책에 맞게 조정
        if (!reservation.getUser().getUserId().equals(userId)) {
            throw new AccessDeniedException("해당 예약에 대한 리뷰 권한이 없습니다.");
        }

        // 3) 중복 리뷰 방지
        if (reviewRepository.existsByReservation_ReservationIdAndUser_UserId(reservation.getReservationId(), userId)) {
            throw new IllegalStateException("이미 해당 예약에 대한 리뷰가 존재합니다.");
        }

        // 4) 작성자, 예약 참조 엔티티 로드
        UserEntity writer = userRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        final String original = defaultIfNull(registReviewRequestDto.getOriginalContent(), "");
        ReviewEntity review;
        if(writer.getLanguage().equals(Language.KOR)){
            review = reviewRepository.save(ReviewEntity.builder()
                    .reservation(reservation)
                    .user(writer)
                    .rating(registReviewRequestDto.getRating())
                    .content(original)
                    .originalLang(writer.getLanguage())
                    .build());

        }
        else{
            review = reviewRepository.save(ReviewEntity.builder()
                    .reservation(reservation)
                    .user(writer)
                    .rating(registReviewRequestDto.getRating())
                    .contentEng(original)
                    .originalLang(writer.getLanguage())
                    .build());
        }
        sqsSendService.sendReviewTransMessage(new ReviewRequestDto(original, writer.getLanguage()), review.getReviewId());
        stayService.recalculateRating(reservation.getStay().getId(), registReviewRequestDto.getRating());
        return review.getReviewId();
    }

    @Override
    public List<ReviewResponseVo> getListOfReviews(Long userId) {
        List<ReviewEntity> entities =
                reviewRepository.findAllByUser_UserIdOrderByCreatedAtDesc(userId);

        return entities.stream()
                .map(ReviewResponseVo::fromEntity)
                .toList();
    }

    @Override
    @Transactional
    public Long updateReview(Long reviewId, ReviewTranslationResultDto reviewTranslationResultDto) {
        ReviewEntity review = reviewRepository.findById(reviewId).orElseThrow();
        review.addTranslation(reviewTranslationResultDto);
        return reviewId;
    }

    @Override
    public ReviewDetailResponseVo getReviewDetail(Long userId, Long reviewId) {

        ReviewEntity entity = reviewRepository.findById(reviewId)
                        .orElseThrow(() -> new BaseException(BaseResponseStatus.NO_REVIEW));

        if(!entity.getUser().getUserId().equals(userId)) throw new BaseException(BaseResponseStatus.NO_ACCESS_AUTHORITY);

        return ReviewDetailResponseVo.fromEntity(entity);
    }

    @Override
    public List<StayReviewResponseVo> getStayReview(Long userId, Long stayId) {
        UserEntity user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new BaseException(BaseResponseStatus.NO_EXIST_USER));
        Language language = user.getLanguage();

        List<ReviewEntity> entities =
//                reviewRepository.findAllByStayIdOrderByCreatedAtDesc(stayId);
                reviewRepository.findAllByStayIdOrderByCreatedAtDescWithJoins(stayId);

        return entities.stream()
                .map(e -> StayReviewResponseVo.fromEntity(e, language, user.getNickname()))
                .toList();
    }

    private static String defaultIfNull(String s, String dft) {
        return (s == null) ? dft : s;
    }

    // 번역문 제약(2000자) -> DB 에러 예방
    private static String trimTo2000(String s) {
        if (s == null) return null;
        return (s.length() > 2000) ? s.substring(0, 2000) : s;
    }

    // NullPointException 안전 접근 유틸
    private static <T> T getOrNull(Supplier<T> supplier) {
        try { return supplier.get(); } catch (Exception e) { return null; }
    }

}
