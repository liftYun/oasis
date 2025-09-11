package org.muhan.oasis.reservation.service;

import org.muhan.oasis.reservation.dto.in.RegistReservationRequestDto;

public interface ReservationService {
    String registReserVation(Long userId, RegistReservationRequestDto from);
}
