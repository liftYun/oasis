package org.muhan.oasis.stay.service;


import org.muhan.oasis.stay.dto.in.CreateStayRequestDto;
import org.muhan.oasis.stay.dto.out.StayResponseDto;
import org.muhan.oasis.stay.dto.out.StayReadResponseDto;
import org.muhan.oasis.valueobject.Language;

import java.math.BigDecimal;

public interface StayService {
    StayResponseDto registStay(CreateStayRequestDto stayRequest, Long userId);

    StayReadResponseDto getStayById(Long stayId, Language language);

    StayResponseDto updateStay(Long stayId);

    void recalculateRating(Long stayId, BigDecimal rating);

    void deleteStay(Long stayId, String userUuid);
}
