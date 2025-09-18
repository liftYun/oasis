package org.muhan.oasis.reservation.service;

import org.muhan.oasis.reservation.dto.in.RegistReservationRequestDto;
import org.muhan.oasis.reservation.dto.out.ReservationDetailsResponseDto;
import org.muhan.oasis.reservation.vo.out.CancelReservationResponseVo;
import org.muhan.oasis.reservation.vo.out.ListOfReservationResponseVo;
import org.muhan.oasis.reservation.vo.out.ListOfReservedDayResponseVo;
import org.muhan.oasis.valueobject.Language;

import java.util.UUID;

public interface ReservationService {
    String registReserVation(Long userId, RegistReservationRequestDto from);

    ListOfReservationResponseVo getListOfReservation(Long userId);

    ListOfReservedDayResponseVo getListOfReservedDay(Long userId, Long stayId);

    ReservationDetailsResponseDto getReservationDetails(Long userId, Language language, String reservationId);

    CancelReservationResponseVo cancelReservation(String userId, String resId, UUID idempotencyKey);
}
