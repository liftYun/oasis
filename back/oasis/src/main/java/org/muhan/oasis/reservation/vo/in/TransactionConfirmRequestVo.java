package org.muhan.oasis.reservation.vo.in;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor

public class TransactionConfirmRequestVo {
    private String challengeId;
    private String status; // "SUCCESS" 또는 "FAILED"

    public TransactionConfirmRequestVo(String challengeId, String status) {
        this.challengeId = challengeId;
        this.status = status;
    }

    // 상태 검증 메서드
    public boolean isSuccess() {
        return "SUCCESS".equals(this.status);
    }

    public boolean isFailed() {
        return "FAILED".equals(this.status);
    }
}
