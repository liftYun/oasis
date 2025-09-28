package org.muhan.oasis.stay.vo.out;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import org.muhan.oasis.stay.dto.out.*;
import org.muhan.oasis.stay.entity.StayBlockEntity;
import org.muhan.oasis.stay.entity.StayEntity;
import org.muhan.oasis.stay.entity.StayFacilityEntity;
import org.muhan.oasis.valueobject.Language;

import java.util.List;
@Getter
@Builder
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class DetailsOfStayResponseVo {
    Long stayId;
    String title;
    String description;
    String region;
    String subRegion;
    String postalCode;
    String addressLine;
    String addrDetail;
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

    public static DetailsOfStayResponseVo from(
            StayEntity stay,
            List<StayFacilityEntity> facilities,
            Language language,
            List<StayBlockEntity> blockList,
            List<ReservedResponseDto> reservedList) {
        return DetailsOfStayResponseVo.builder()
                .stayId(stay.getId())
                .title(stay.title(language))
                .description(stay.description(language))
                .region(language == Language.KOR
                        ? stay.getSubRegionEntity().getRegion().getName()
                        : stay.getSubRegionEngEntity().getRegion().getName())
                .subRegion(language == Language.KOR
                        ? stay.getSubRegionEntity().getSubName()
                        : stay.getSubRegionEngEntity().getSubName())
                .addressLine(language == Language.KOR
                        ? stay.getAddressLine()
                        : stay.getAddressLineEng())
                .addrDetail(language == Language.KOR
                        ? stay.getAddrDetail()
                        : stay.getAddrDetailEng())
                .postalCode(stay.getPostalCode())
                .maxGuest(stay.getMaxGuests())
                .price(stay.getPrice())
                .photos(ImageResponseDto.from(stay.getStayPhotoEntities()))
                .review(stay.getRatingSummary()!=null ? StayReviewSummaryResponseDto.from(stay.getRatingSummary(), language) : null)
                .host(HostInfoResponseDto.from(stay.getUser()))
                .facilities(FacilityCategoryResponseDto.from(facilities))
                .cancellations(StayBlockResponseDto.from(blockList))
                .reservedDate(reservedList)
                .build();
    }
}
