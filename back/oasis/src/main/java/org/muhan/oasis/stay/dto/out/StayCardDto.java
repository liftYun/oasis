package org.muhan.oasis.stay.dto.out;

import org.muhan.oasis.stay.entity.StayEntity;
import org.muhan.oasis.valueobject.Language;

import java.math.BigDecimal;

public record StayCardDto(
        Long stayId,
        String title,
        String thumbnail,
        BigDecimal rating,
        Integer price
) {

    public static StayCardDto from(StayEntity e, Language language){
        String title = language.equals(Language.KOR) ? e.getTitle() : e.getTitleEng();
        return new StayCardDto(e.getId(), title, e.getThumbnail(), e.getRatingSummary().getAvgRating(), e.getPrice());
    }
}
