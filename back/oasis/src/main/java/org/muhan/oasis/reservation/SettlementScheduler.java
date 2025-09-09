package org.muhan.oasis.reservation;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.muhan.oasis.reservation.repository.ReservationRepository;
import org.muhan.oasis.reservation.service.SettlementService;
import org.muhan.oasis.web3.service.Web3Service;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.ZoneOffset;

@Component
@Slf4j
@RequiredArgsConstructor
public class SettlementScheduler {
    private final ReservationRepository repo;
    private final SettlementService service;

    @Scheduled(cron = "0 */5 * * * *")
    public void run() {
        var cutoffUtc = LocalDateTime.now(ZoneOffset.UTC).minusSeconds(10);
        var targets = repo.findDueForRelease(cutoffUtc);

        for (var r : targets) {
            try {
                service.settleOne(r); // 트랜잭션 안에서 처리됨
            } catch (Exception e) {
                log.warn("release failed: resId={}, err={}", r.getReservationId(), e.getMessage());
            }
        }
    }
}


