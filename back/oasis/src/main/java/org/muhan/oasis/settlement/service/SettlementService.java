package org.muhan.oasis.settlement.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.muhan.oasis.config.Web3jConfig;
import org.muhan.oasis.reservation.entity.ReservationEntity;
import org.muhan.oasis.reservation.enums.ReservationStatus;
import org.muhan.oasis.reservation.repository.ReservationRepository;
import org.muhan.oasis.web3.Web3Service;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
// 정산 서비스
public class SettlementService {
    private final ReservationRepository reservationRepository;
    private final Web3Service web3Service;
    private final Web3jConfig web3jConfig;

    @Transactional
    public void processSettlement() throws Exception {
        LocalDateTime now = LocalDateTime.now();

        // DB에서 settle 안 된 예약들 조회
        List<ReservationEntity> unsettled =
                reservationRepository.findUnsettledByStatuses(
                        now,
                        List.of(ReservationStatus.LOCKED, ReservationStatus.SETTLEMENT_FAILED)
                );

        for (ReservationEntity r : unsettled) {
            try {

                //정산 가능 여부 확인 -> 컨트랙트 수정 필요
//                if (!web3.canRelease(r.getReservationId())) {
//                    log.info("⚠️ Skip settlement for resId={} (not releasable on-chain)", r.getReservationId());
//                    continue;
//                }

                // 온체인 release
                String txHash  = web3Service.releaseAndWait(r.getReservationId());

                // DB 상태 업데이트
                reservationRepository.markSettled(r.getReservationId(), ReservationStatus.SETTLEMENTED);

                // 로그 저장
                log.info("✅ Settlement success for resId={} tx={}", r.getReservationId(), txHash);

            } catch (Exception e) {
                // 실패했을 경우 로깅 (DB 상태는 그대로 두고 다음 주기에 재시도)
                if (e instanceof java.io.IOException) {
                    log.warn("🔌 WebSocket disconnected, trying to reconnect...");
                    web3jConfig.reconnect();
                    // (선택) 재시도 로직
                    try {
                        String txHash = web3Service.releaseAndWait(r.getReservationId());
                        reservationRepository.markSettled(r.getReservationId(), ReservationStatus.SETTLEMENTED);
                        log.info("✅ Settlement success after reconnect for resId={} tx={}", r.getReservationId(), txHash);
                        continue; // 다음 예약 처리
                    } catch (Exception retryEx) {
                        reservationRepository.markSettled(r.getReservationId(), ReservationStatus.SETTLEMENT_FAILED);
                        log.error("❌ Settlement retry failed for resId={} reason={}", r.getReservationId(), retryEx.getMessage());
                    }
                } else {
                    log.warn("❌ Settlement failed for resId={} reason={}", r.getReservationId(), e.getMessage());
                }
                reservationRepository.markSettled(r.getReservationId(), ReservationStatus.SETTLEMENT_FAILED);
            }
        }
    }
}
