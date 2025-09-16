package org.muhan.oasis.settlement.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.muhan.oasis.reservation.entity.ReservationEntity;
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
    private final Web3Service web3;

    @Transactional
    public void processSettlement() throws Exception {
        LocalDateTime now = LocalDateTime.now();
        // 1) DB에서 settle 안 된 예약들 조회
        List<ReservationEntity> unsettled =
                reservationRepository.findByIsSettlementedFalseAndCheckoutDateBefore(now);

        for (ReservationEntity r : unsettled) {
            try {

                //정산 가능 여부 확인 -> 컨트랙트 수정 필요
//                if (!web3.canRelease(r.getReservationId())) {
//                    log.info("⚠️ Skip settlement for resId={} (not releasable on-chain)", r.getReservationId());
//                    continue;
//                }

                // 2) 온체인 release
                String txHash  = web3.releaseAndWait(r.getReservationId());

                // 3) DB 상태 업데이트
                reservationRepository.markSettled(r.getReservationId());

                // 선택: 로그 저장
                log.info("✅ Settlement success for resId={} tx={}", r.getReservationId(), txHash);

            } catch (Exception e) {
                // 실패했을 경우 로깅 (DB 상태는 그대로 두고 다음 주기에 재시도)
                log.warn("❌ Settlement failed for resId={} reason={}", r.getReservationId(), e.getMessage());
            }
        }
    }
}
