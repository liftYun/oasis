package org.muhan.oasis.wish.service;

import org.muhan.oasis.stay.dto.out.StayCardDto;
import org.muhan.oasis.wish.dto.in.CreateWishRequestDto;
import org.muhan.oasis.wish.dto.out.WishResponseDto;

import java.util.List;

public interface WishService {
    Long addWish(String userUuid, CreateWishRequestDto wishRequestDto);

    List<WishResponseDto> findAllByUser(String userUuid);
}
