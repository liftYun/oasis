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

    public static StayReadResponseDto from(StayEntity stay, Language language) {

        return StayReadResponseDto.builder()
                .title(language == Language.KOR ? stay.getTitle() : stay.getTitleEng())
                .description(language == Language.KOR ? stay.getDescription() : stay.getDescriptionEng())
                .region(language == Language.KOR ? stay.getSubRegionEntity().getRegion().getName() : stay.getSubRegionEngEntity().getRegion().getName())
                .subRegion(language == Language.KOR ? stay.getSubRegionEntity().getSubName() : stay.getSubRegionEngEntity().getSubName())
                .postalCode(stay.getPostalCode())
                .maxGuest(stay.getMaxGuests())
                .price(stay.getPrice())
                .photos(ImageResponseDto.from(stay.getStayPhotoEntities()))
                .review(StayReviewResponseDto.from(stay.getRatingSummary()))
                .host(HostInfoResponseDto.from(stay.getUser()))
                .build();
    }
}
