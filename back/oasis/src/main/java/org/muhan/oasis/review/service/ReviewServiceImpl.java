package org.muhan.oasis.review.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.muhan.oasis.openAI.service.OpenAIService;
import org.muhan.oasis.openAI.dto.out.ReviewTranslationResult;
import org.muhan.oasis.openAI.service.OpenAIService;
import org.muhan.oasis.reservation.entity.ReservationEntity;
import org.muhan.oasis.reservation.repository.ReservationRepository;
import org.muhan.oasis.review.dto.in.RegistReviewRequestDto;
import org.muhan.oasis.review.dto.out.ReviewResponseDto;
import org.muhan.oasis.review.entity.ReviewEntity;
import org.muhan.oasis.review.repository.ReviewRepository;
import org.muhan.oasis.review.vo.in.RegistReviewRequestVo;
import org.muhan.oasis.review.vo.out.ReviewResponseVo;
import org.muhan.oasis.user.entity.UserEntity;
import org.muhan.oasis.user.repository.UserRepository;
import org.muhan.oasis.valueobject.Language;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.function.Supplier;

@Service
@Log4j2
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService{
    private final ReservationRepository reservationRepository;
    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;
    private final OpenAIService openAIService;

    @Override
    public Long registReview(Long userId, RegistReviewRequestDto registReviewRequestDto) {
        // 1) 예약 존재 확인
        ReservationEntity reservation = reservationRepository.findById(registReviewRequestDto.getReservationId())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 예약입니다."));

        // 2) 예약 소유자(또는 이용자) 검증 — 정책에 맞게 조정
        if (!reservation.getUserId().getUserId().equals(userId)) {
            throw new AccessDeniedException("해당 예약에 대한 리뷰 권한이 없습니다.");
        }

        // 3) 중복 리뷰 방지
        if (reviewRepository.existsByReservation_IdAndUser_Id(reservation.getReservationId(), userId)) {
            throw new IllegalStateException("이미 해당 예약에 대한 리뷰가 존재합니다.");
        }

        // 4) 작성자, 예약 참조 엔티티 로드
        UserEntity writer = userRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        final String original = defaultIfNull(registReviewRequestDto.getOriginalContent(), "");
        String koreanContent = null;
        String englishContent = null;
        Language originalLang = null;

        try {
            ReviewRequestDto dto = new ReviewRequestDto(original);
            ReviewTranslationResult tr = openAIService.getTranslateReview(dto);

            String detected = defaultIfNull(tr.getDetectedLocale(), "unknown");

            switch (detected) {
                case "ko":
                    // 원문이 한국어 → 영문 번역 저장
                    koreanContent = original;
                    englishContent = trimTo2000(getOrNull(() -> tr.getEnglishVersion().getContent()));
                    originalLang = Language.KOR;
                    break;

                case "en":
                    // 원문이 영어 → 한국어 번역 저장
                    englishContent = original;
                    koreanContent = trimTo2000(getOrNull(() -> tr.getKoreanVersion().getContent()));
                    originalLang = Language.ENG;
                    break;

                default:
                    // unknown 또는 공백 입력 → 번역 없이 원문만 보존(한글 슬롯에 보관하여 후방호환)
                    koreanContent = original;
                    englishContent = null;
                    originalLang = null; // 혹은 Language.UNKNOWN 사용
            }
        } catch (com.fasterxml.jackson.core.JsonProcessingException e) {
            log.warn("[Review][translate] JSON 처리 오류 — 원문 저장. reservationId={}, userId={}, msg={}",
                    registReviewRequestDto.getReservationId(), userId, e.getMessage(), e);
            koreanContent = original;
        } catch (org.springframework.web.client.RestClientException e) {
            log.warn("[Review][translate] OpenAI 호출 실패 — 원문 저장. reservationId={}, userId={}, msg={}",
                    registReviewRequestDto.getReservationId(), userId, e.getMessage(), e);
            koreanContent = original;
        } catch (java.io.IOException e) {
            log.warn("[Review][translate] I/O 오류 — 원문 저장. reservationId={}, userId={}, msg={}",
                    registReviewRequestDto.getReservationId(), userId, e.getMessage(), e);
            koreanContent = original;
        }

        // 5) 저장
        ReviewEntity review = ReviewEntity.builder()
                .reservationId(reservation)
                .userId(writer)
                .rating(registReviewRequestDto.getRating())
                .content(koreanContent)
                .contentEng(englishContent)
                .originalLang(originalLang)
                .build();

        reviewRepository.save(review);

        // TODO : 숙소 평점 집계 업데이트 진행
        // stayService.recalculateRating(reservation.getStay().getId());

        return review.getReviewId();
    }

    @Override
    public List<ReviewResponseVo> getListOfReviews(Long userId) {
        List<ReviewEntity> entities =
                reviewRepository.findAllByUser_IdOrderByCreatedAtDesc(userId);

        return entities.stream()
                .map(ReviewResponseVo::fromEntity)
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
