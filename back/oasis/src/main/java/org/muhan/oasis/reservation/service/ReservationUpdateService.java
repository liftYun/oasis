package org.muhan.oasis.reservation.service;

import lombok.RequiredArgsConstructor;
import org.muhan.oasis.reservation.repository.ReservationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ReservationUpdateService {

    private final ReservationRepository reservationRepository;

    @Transactional
    public void markCanceled(String reservationId) {
        if (reservationRepository.existsById(reservationId)) {
            reservationRepository.markCanceled(reservationId);
        }
    }
}
