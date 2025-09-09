package org.muhan.oasis.reservation.service;

import lombok.RequiredArgsConstructor;
import org.muhan.oasis.reservation.entity.Reservation;
import org.muhan.oasis.reservation.repository.ReservationRepository;
import org.muhan.oasis.web3.service.Web3Service;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
//정산 서비스
public class SettlementService {
    private final ReservationRepository reservationRepository;
    private final Web3Service web3;

    @Transactional
    public void settleOne(Reservation r) throws Exception {
        // 1) 온체인 release (아래 2번 해결안 적용된 web3.releaseAndWait 사용)
        var receipt = web3.releaseAndWait(r.getReservationId());

        // 2) DB 업데이트 (여기가 트랜잭션 안)
        reservationRepository.markSettled(r.getReservationId());
    }
}
