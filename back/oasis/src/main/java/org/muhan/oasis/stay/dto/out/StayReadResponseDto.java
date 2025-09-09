package org.muhan.oasis.stay.dto.out;

import lombok.AllArgsConstructor;
import lombok.Builder;
import org.muhan.oasis.stay.entity.StayEntity;
import org.muhan.oasis.stay.entity.StayPhotoEntity;
import org.muhan.oasis.valueobject.Language;
import org.springframework.cglib.core.Local;

import java.util.List;

@AllArgsConstructor
@Builder
public class StayReadResponseDto{
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
    StayReviewResponseDto review;
    // nickname, uuid, url(프로필이미지)
    HostInfoResponseDto host;

    private static String nvl(String a, String b) {
        return (a != null && !a.isBlank()) ? a : b;
    }

    public static StayReadResponseDto from(StayEntity stay, Language language) {

        boolean isKor = language == Language.KOR;

        String title = isKor ? nvl(stay.getTitle(), stay.getTitleEng())
                : nvl(stay.getTitleEng(), stay.getTitle());
        String desc  = isKor ? nvl(stay.getDescription(), stay.getDescriptionEng())
                : nvl(stay.getDescriptionEng(), stay.getDescription());

        String region = isKor
                ? stay.getSubRegionEntity().getRegion().getName()
                : stay.getSubRegionEngEntity().getRegion().getName();

        String subRegion = isKor
                ? stay.getSubRegionEntity().getSubName()
                : stay.getSubRegionEngEntity().getSubName();

        var summary = stay.getRatingSummary();

        return StayReadResponseDto.builder()
                .title(title)
                .description(desc)
                .region(region)
                .subRegion(subRegion)
                .postalCode(stay.getPostalCode())
                .maxGuest(stay.getMaxGuests())
                .price(stay.getPrice())
                .photos(ImageResponseDto.from(stay.getStayPhotoEntities()))
                .review(summary != null ? StayReviewResponseDto.from(summary) : null)
                .host(HostInfoResponseDto.from(stay.getUser()))
                .build();
    }
}
