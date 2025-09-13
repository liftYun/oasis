package org.muhan.oasis.reservation.service;

import org.muhan.oasis.reservation.dto.in.RegistReservationRequestDto;
import org.muhan.oasis.reservation.vo.out.ListOfReservationResponseVo;
import org.muhan.oasis.reservation.vo.out.ListOfReservedDayVo;

public interface ReservationService {
    String registReserVation(Long userId, RegistReservationRequestDto from);

    ListOfReservationResponseVo getListOfReservation(Long userId);

    ListOfReservedDayVo getListOfReservedDay(Long userId, Long stayId);
}
