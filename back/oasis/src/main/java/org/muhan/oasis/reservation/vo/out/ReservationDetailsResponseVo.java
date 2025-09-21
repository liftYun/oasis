package org.muhan.oasis.reservation.vo.out;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.muhan.oasis.reservation.dto.out.ReservationDetailsResponseDto;
import org.muhan.oasis.stay.entity.StayRatingSummaryEntity;
import org.muhan.oasis.valueobject.Category;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * 예약 상세 화면 응답 VO
 * - ReservationEntity + StayEntity + StayRatingSummaryEntity + KeyOwnerEntity 등 집계
 */
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ReservationDetailsResponseVo {

    /** ===== 예약 ===== */
    private String reservationId;
    private LocalDateTime reservationDate;
    private boolean isCanceled;
    private boolean isSettlemented;
    private boolean isReviewed;
    private int payment;

    /** ===== 일정 ===== */
    private ScheduleInfo schedule;

    /** ===== 숙소 정보 ===== */
    private StayInfo stay;

    /** ===== 스마트키/참여자 ===== */
    private Participants participants;

    /** ===== 리뷰 요약 ===== */
    private ReviewSummary review;

    /** ===== 호스트 정보 ===== */
    private HostInfo host;


    @Getter
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class ScheduleInfo {
        private LocalDateTime checkinDate;
        private LocalDateTime checkoutDate;
     }

    @Getter
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class StayInfo {
        private Long stayId;
        private String title;
        private String titleEng;
        private String description;
        private String descriptionEng;

        private String addressLine;
        private String addressLineEng;
        private String addrDetail;
        private String addrDetailEng;
        private String postalCode;

        private List<String> photos;
        private List<FacilityCategory> facilities;
    }

    @Getter
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class FacilityCategory {
        private Category category;
        private List<FacilityItem> facilities;
    }

    @Getter
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class FacilityItem {
        private Long id;
        private String name;
        private String nameEng;
    }

    @Getter
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class Participants {
        private Integer count;
        private List<ParticipantBrief> members;
    }

    @Getter
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class ParticipantBrief {
        private String nickname;
        private String profileImageUrl;
    }

    /**
     * StayRatingSummaryEntity 기반 리뷰 요약
     */
    @Getter
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class ReviewSummary {
        private Integer ratingCnt;          // ratingCnt
        private BigDecimal avgRating;       // avgRating (소수점 1자리)

        private String highRateSummary;     // 한글 AI 요약
        private String highRateSummaryEng;  // 영어 AI 요약
        private String lowRateSummary;      // 한글 개선 요약
        private String lowRateSummaryEng;   // 영어 개선 요약
    }

    @Getter
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class HostInfo {
        private String nickname;
        private String uuid;
        private String profileImageUrl;
    }

    public static ReviewSummary from(StayRatingSummaryEntity e) {
        if (e == null) return null;
        return ReviewSummary.builder()
                .ratingCnt(e.getRatingCnt())
                .avgRating(e.getAvgRating())
                .highRateSummary(e.getHighRateSummary())
                .highRateSummaryEng(e.getHighRateSummaryEng())
                .lowRateSummary(e.getLowRateSummary())
                .lowRateSummaryEng(e.getLowRateSummaryEng())
                .build();
    }
    public static ReservationDetailsResponseVo fromDto(ReservationDetailsResponseDto dto) {
        if (dto == null) return null;

        // 일정
        ScheduleInfo scheduleVo = null;
        if (dto.schedule() != null) {
            scheduleVo = ScheduleInfo.builder()
                    .checkinDate(dto.schedule().checkinDate())
                    .checkoutDate(dto.schedule().checkoutDate())
                    .build();
        }

        // 숙소
        StayInfo stayVo = null;
        if (dto.stay() != null) {
            List<FacilityCategory> facilityCategories = null;
            if (dto.stay().facilities() != null) {
                facilityCategories = dto.stay().facilities().stream()
                        .map(fc -> FacilityCategory.builder()
                                .category(fc.category())
                                .facilities(
                                        fc.facilities() == null ? null :
                                                fc.facilities().stream()
                                                        .map(fi -> FacilityItem.builder()
                                                                .id(fi.id())
                                                                .name(fi.name())
                                                                .nameEng(fi.nameEng())
                                                                .build()
                                                        ).toList()
                                )
                                .build()
                        ).toList();
            }

            stayVo = StayInfo.builder()
                    .stayId(dto.stay().stayId())
                    .title(dto.stay().title())
                    .titleEng(dto.stay().titleEng())
                    .description(dto.stay().description())
                    .descriptionEng(dto.stay().descriptionEng())
                    .addressLine(dto.stay().addressLine())
                    .addressLineEng(dto.stay().addressLineEng())
                    .addrDetail(dto.stay().addrDetail())
                    .addrDetailEng(dto.stay().addrDetailEng())
                    .postalCode(dto.stay().postalCode())
                    .photos(dto.stay().photos())
                    .facilities(facilityCategories)
                    .build();
        }

        // 참여자
        Participants participantsVo = null;
        if (dto.participants() != null) {
            participantsVo = Participants.builder()
                    .count(dto.participants().count())
                    .members(
                            dto.participants().members() == null ? null :
                                    dto.participants().members().stream()
                                            .map(m -> ParticipantBrief.builder()
                                                    .nickname(m.nickname())
                                                    .profileImageUrl(m.profileImageUrl())
                                                    .build()
                                            ).toList()
                    )
                    .build();
        }

        // 리뷰 요약
        ReviewSummary reviewVo = null;
        if (dto.review() != null) {
            reviewVo = ReviewSummary.builder()
                    .ratingCnt(dto.review().ratingCnt())
                    .avgRating(dto.review().avgRating())
                    .highRateSummary(dto.review().highRateSummary())
                    .highRateSummaryEng(dto.review().highRateSummaryEng())
                    .lowRateSummary(dto.review().lowRateSummary())
                    .lowRateSummaryEng(dto.review().lowRateSummaryEng())
                    .build();
        }

        // 호스트
        HostInfo hostVo = null;
        if (dto.host() != null) {
            hostVo = HostInfo.builder()
                    .nickname(dto.host().nickname())
                    .uuid(dto.host().uuid())
                    .profileImageUrl(dto.host().profileImageUrl())
                    .build();
        }

        return ReservationDetailsResponseVo.builder()
                .reservationId(dto.reservationId())
                .reservationDate(dto.reservationDate())
                .isCanceled(dto.isCanceled())
                .isSettlemented(dto.isSettlemented())
                .isReviewed(dto.isReviewed())
                .payment(dto.payment())
                .schedule(scheduleVo)
                .stay(stayVo)
                .participants(participantsVo)
                .review(reviewVo)
                .host(hostVo)
                .build();
    }
}
