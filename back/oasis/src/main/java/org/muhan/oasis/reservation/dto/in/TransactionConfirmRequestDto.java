package org.muhan.oasis.reservation.dto.in;

import lombok.Getter;
import lombok.NoArgsConstructor;
import org.muhan.oasis.reservation.vo.in.TransactionConfirmRequestVo;

@Getter
@NoArgsConstructor
public class TransactionConfirmRequestDto {
    private String challengeId;
    private String status; // "SUCCESS" 또는 "FAILED"

    public TransactionConfirmRequestDto(String challengeId, String status) {
        this.challengeId = challengeId;
        this.status = status;
    }

    // VO에서 DTO로 변환하는 팩토리 메서드
    public static TransactionConfirmRequestDto from(TransactionConfirmRequestVo vo) {
        return new TransactionConfirmRequestDto(vo.getChallengeId(), vo.getStatus());
    }

    // 상태 검증 메서드
    public boolean isSuccess() {
        return "SUCCESS".equals(this.status);
    }

    public boolean isFailed() {
        return "FAILED".equals(this.status);
    }
}