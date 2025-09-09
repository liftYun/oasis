package org.muhan.oasis.stay.service;


import org.muhan.oasis.stay.dto.in.CreateStayRequestDto;
import org.muhan.oasis.stay.dto.out.StayCreateResponseDto;

public interface StayService {
    StayCreateResponseDto registStay(CreateStayRequestDto stayRequest, Long userId);
    StayCreateResponseDto updateStay

}
