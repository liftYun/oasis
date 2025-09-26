package org.muhan.oasis.stay.dto.out;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import org.muhan.oasis.stay.entity.CancellationPolicyEntity;
import org.muhan.oasis.stay.entity.StayBlockEntity;
import org.muhan.oasis.stay.entity.StayEntity;
import org.muhan.oasis.stay.entity.StayFacilityEntity;
import org.muhan.oasis.valueobject.Language;

import java.util.List;

@Getter
@Builder @AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class StayReadResponseDto{
    Long stayId;
    String title;
    String description;
    String region;
    String subRegion;
    String postalCode;
    Integer maxGuest;
    Integer price;
    // url, sortOrder 들어감
    List<ImageResponseDto> photos;
    // rating, 리뷰갯수, 높은별점리뷰요약, 낮은별점리뷰요약
    StayReviewSummaryResponseDto review;
    // nickname, uuid, url(프로필이미지)
    HostInfoResponseDto host;
    List<FacilityCategoryResponseDto> facilities;
    // 취소정책
    List<StayBlockResponseDto> cancellations;
    List<ReservedResponseDto> reservedDate;

    public static StayReadResponseDto from(
            StayEntity stay,
            List<StayFacilityEntity> facilities,
            Language language,
            List<StayBlockEntity> blockList,
            List<ReservedResponseDto> reservedList) {
        return StayReadResponseDto.builder()
                .stayId(stay.getId())
                .title(stay.title(language))
                .description(stay.description(language))
                .region(language == Language.KOR
                        ? stay.getSubRegionEntity().getRegion().getName()
                        : stay.getSubRegionEngEntity().getRegion().getName())
                .subRegion(language == Language.KOR
                        ? stay.getSubRegionEntity().getSubName()
                        : stay.getSubRegionEngEntity().getSubName())
                .postalCode(stay.getPostalCode())
                .maxGuest(stay.getMaxGuests())
                .price(stay.getPrice())
                .photos(ImageResponseDto.from(stay.getStayPhotoEntities()))
                .review(stay.getRatingSummary()!=null ? StayReviewSummaryResponseDto.from(stay.getRatingSummary()) : null)
                .host(HostInfoResponseDto.from(stay.getUser()))
                .facilities(FacilityCategoryResponseDto.from(facilities))
                .cancellations(StayBlockResponseDto.from(blockList))
                .reservedDate(reservedList)
                .build();
    }

}
