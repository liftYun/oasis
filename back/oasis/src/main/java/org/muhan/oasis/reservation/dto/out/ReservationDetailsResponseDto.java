package org.muhan.oasis.reservation.dto.out;

import org.muhan.oasis.valueobject.Category;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record ReservationDetailsResponseDto(
        // ===== 예약 =====
        String reservationId,
        LocalDateTime reservationDate,
        boolean isCanceled,
        boolean isSettlemented,
        boolean isReviewed,
        int payment,

        // ===== 일정 =====
        ScheduleInfoDto schedule,

        // ===== 숙소 정보 =====
        StayInfoDto stay,

        // ===== 스마트키/참여자 =====
        ParticipantsDto participants,

        // ===== 리뷰 요약 =====
        ReviewSummaryDto review,

        // ===== 호스트 정보 =====
        HostInfoDto host
) {

    /* ===== Nested DTOs ===== */

    public record ScheduleInfoDto(
            LocalDateTime checkinDate,
            LocalDateTime checkoutDate
    ) {}

    public record StayInfoDto(
            Long stayId,
            String title,
            String titleEng,
            String description,
            String descriptionEng,

            String addressLine,
            String addressLineEng,
            String addrDetail,
            String addrDetailEng,
            String postalCode,

            List<String> photos,
            List<FacilityCategoryDto> facilities
    ) {}

    public record FacilityCategoryDto(
            Category category,
            List<FacilityItemDto> facilities
    ) {}

    public record FacilityItemDto(
            Long id,
            String name,
            String nameEng
    ) {}

    public record ParticipantsDto(
            Integer count,
            List<ParticipantBriefDto> members
    ) {}

    public record ParticipantBriefDto(
            String nickname,
            String profileImageUrl
    ) {}

    public record ReviewSummaryDto(
            Integer ratingCnt,
            BigDecimal avgRating,
            String highRateSummary,
            String highRateSummaryEng,
            String lowRateSummary,
            String lowRateSummaryEng
    ) {}

    public record HostInfoDto(
            String nickname,
            String uuid,
            String profileImageUrl
    ) {}
}
