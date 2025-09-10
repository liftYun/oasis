package org.muhan.oasis.stay.service;


import org.muhan.oasis.stay.dto.in.CreateStayRequestDto;
import org.muhan.oasis.stay.dto.out.StayResponseDto;
import org.muhan.oasis.stay.dto.out.StayReadResponseDto;
import org.muhan.oasis.valueobject.Language;

public interface StayService {
    StayResponseDto registStay(CreateStayRequestDto stayRequest, Long userId);

    StayReadResponseDto getStayById(Long stayId, Language language);

    StayResponseDto updateStay(Long stayId);
}
