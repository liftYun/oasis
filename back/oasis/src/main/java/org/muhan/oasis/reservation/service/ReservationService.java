package org.muhan.oasis.reservation.service;

import org.muhan.oasis.reservation.dto.in.RegistReservationRequestDto;
import org.muhan.oasis.reservation.vo.out.ListOfReservationResponseVo;

public interface ReservationService {
    String registReserVation(Long userId, RegistReservationRequestDto from);

    ListOfReservationResponseVo getListOfResevation(Long userId);
}
