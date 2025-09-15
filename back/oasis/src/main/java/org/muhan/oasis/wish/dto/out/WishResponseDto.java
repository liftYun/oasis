package org.muhan.oasis.wish.dto.out;

import org.muhan.oasis.stay.dto.out.StayCardDto;
import org.muhan.oasis.valueobject.Language;
import org.muhan.oasis.wish.entity.WishEntity;

public record WishResponseDto(
        Long id,
        StayCardDto stayCardDto
) {
    public static WishResponseDto from(WishEntity e, Language language){
        return new WishResponseDto(
                e.getId(),
                StayCardDto.from(e.getStay(), language)
        );
    }
}
