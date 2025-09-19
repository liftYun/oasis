package org.muhan.oasis.stay.service;


import org.muhan.oasis.stay.dto.in.CreateStayRequestDto;
import org.muhan.oasis.stay.dto.in.StayChatRequestDto;
import org.muhan.oasis.stay.dto.in.StayQueryRequestDto;
import org.muhan.oasis.stay.dto.in.UpdateStayRequestDto;
import org.muhan.oasis.stay.dto.out.*;
import org.muhan.oasis.valueobject.Language;

import java.math.BigDecimal;
import java.util.List;

public interface StayService {
    StayResponseDto registStay(CreateStayRequestDto stayRequest, String userUuid);

    StayReadResponseDto getStayById(Long stayId, Language language);

    StayReadResponseDto updateStay(Long stayId, UpdateStayRequestDto stayRequest, String userUuid);

    void recalculateRating(Long stayId, BigDecimal rating);

    void deleteStay(Long stayId, String userUuid);

    List<StayCardDto> searchStay(Long lastStayId, StayQueryRequestDto stayQuery, String userUuid);

    List<StayCardByWishView> searchStayByWish(String userUuid);

    List<StayCardDto> searchStayByRating(String userUuid);

    List<StayChatResponseDto> getStays(List<StayChatRequestDto> stayChatListDto, String userUuid);
}
