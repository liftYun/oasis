package org.muhan.oasis.reservation.dto.out;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Getter;
import org.muhan.oasis.reservation.entity.ReservationEntity;
import org.muhan.oasis.stay.entity.StayEntity;

import java.time.LocalDateTime;

@Getter
@Builder
public class ReservationResponseDto {
    private String reservationId;
    private LocalDateTime checkinDate;
    private LocalDateTime checkoutDate;
    private LocalDateTime reservationDate;
    // boolean 필드는 'is' 접두어를 필드명에서 제거 (Lombok이 isXxx() 생성)
    // 정산 완료 여부로 이용완료 여부 확인
    @JsonProperty("isSettlemented") private boolean settlemented;
    // 리뷰 작성 여부에 따라 리뷰 버튼 활성화
    @JsonProperty("isReviewed")     private boolean reviewed;
    @JsonProperty("isCanceled")      private boolean canceled;
    private Long stayId;
    private String stayTitle;
    private String stayTitleEng;
    // stayEntity로 부터 얻어와야함
    // 썸네일 주소
    private String thumbnail;
    private String addressLine;
    private String addressLineEng;

    public static ReservationResponseDto fromEntity(ReservationEntity r) {
        StayEntity stay = r.getStay();
        return ReservationResponseDto.builder()
                .reservationId(String.valueOf(r.getReservationId()))
                .checkinDate(r.getCheckinDate())
                .checkoutDate(r.getCheckoutDate())
                .reservationDate(r.getReservationDate())
                .settlemented(Boolean.TRUE.equals(r.isSettlemented()))
                .reviewed(Boolean.TRUE.equals(r.isReviewed()))
                .canceled(Boolean.TRUE.equals(r.isCanceled()))
                .stayId(stay != null ? stay.getId() : null)
                .stayTitle(stay != null ? stay.getTitle() : null)
                .stayTitleEng(stay != null ? stay.getTitleEng() : null)
                .thumbnail(stay != null ? stay.getThumbnail() : null)
                .addressLine(stay != null ? stay.getAddressLine() : null)
                .addressLineEng(stay != null ? stay.getAddressLineEng() : null)
                .build();
    }
}
