package org.muhan.oasis.wish.service;

import org.muhan.oasis.wish.dto.in.CreateWishRequestDto;
import org.muhan.oasis.wish.dto.out.WishResponseDto;

public interface WishService {
    Long addWish(String userUuid, CreateWishRequestDto wishRequestDto);
}
