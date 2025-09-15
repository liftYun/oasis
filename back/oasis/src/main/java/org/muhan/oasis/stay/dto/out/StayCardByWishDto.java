package org.muhan.oasis.stay.dto.out;

import org.muhan.oasis.stay.entity.StayEntity;
import org.muhan.oasis.valueobject.Language;

import java.math.BigDecimal;

public record StayCardByWishDto(
        Long stayId,
        String title,
        String thumbnail,
        BigDecimal rating,
        Integer price,
        Long wishCount
) {

}
