package org.muhan.oasis.stay.service;


import org.muhan.oasis.stay.dto.in.CreateStayRequestDto;
import org.muhan.oasis.stay.dto.in.StayQueryRequestDto;
import org.muhan.oasis.stay.dto.out.StayCardByWishDto;
import org.muhan.oasis.stay.dto.out.StayCardDto;
import org.muhan.oasis.stay.dto.out.StayResponseDto;
import org.muhan.oasis.stay.dto.out.StayReadResponseDto;
import org.muhan.oasis.valueobject.Language;

import java.math.BigDecimal;
import java.util.List;

public interface StayService {
    StayResponseDto registStay(CreateStayRequestDto stayRequest, Long userId);

    StayReadResponseDto getStayById(Long stayId, Language language);

    StayResponseDto updateStay(Long stayId);

    void recalculateRating(Long stayId, BigDecimal rating);

    void deleteStay(Long stayId, String userUuid);

    List<StayCardDto> searchStay(Long lastStayId, StayQueryRequestDto stayQuery, String userUuid);

    List<StayCardByWishDto> searchStayByWish(String userUuid);

    List<StayCardDto> searchStayByRating(String userUuid);
}
