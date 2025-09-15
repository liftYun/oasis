package org.muhan.oasis.wish.service;

import lombok.RequiredArgsConstructor;
import org.muhan.oasis.common.base.BaseResponseStatus;
import org.muhan.oasis.common.exception.BaseException;
import org.muhan.oasis.stay.dto.out.StayCardDto;
import org.muhan.oasis.stay.entity.StayEntity;
import org.muhan.oasis.stay.repository.StayRepository;
import org.muhan.oasis.user.entity.UserEntity;
import org.muhan.oasis.user.repository.UserRepository;
import org.muhan.oasis.wish.dto.in.CreateWishRequestDto;
import org.muhan.oasis.wish.dto.out.WishResponseDto;
import org.muhan.oasis.wish.entity.WishEntity;
import org.muhan.oasis.wish.repository.WishRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class WishServiceImpl implements WishService{

    private final UserRepository userRepository;
    private final WishRepository wishRepository;
    private final StayRepository stayRepository;
    @Override
    @Transactional
    public Long addWish(String userUuid, CreateWishRequestDto wishRequestDto) {
        UserEntity user = userRepository.findByUserUuid(userUuid)
                .orElseThrow(() -> new BaseException(BaseResponseStatus.NO_EXIST_USER));


        StayEntity stay = stayRepository.findById(wishRequestDto.stayId())
                .orElseThrow(() -> new BaseException(BaseResponseStatus.NO_STAY));

        WishEntity wish = wishRepository.save(
                WishEntity.builder()
                        .user(user)
                        .stay(stay)
                        .build());

        return wish.getId();
    }
}
