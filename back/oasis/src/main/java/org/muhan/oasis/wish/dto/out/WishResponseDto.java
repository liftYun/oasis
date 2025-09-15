package org.muhan.oasis.wish.dto.out;

import org.muhan.oasis.stay.dto.out.StayCardDto;

public record WishResponseDto(
        Long id,
        StayCardDto stayCardDto
) {
}
