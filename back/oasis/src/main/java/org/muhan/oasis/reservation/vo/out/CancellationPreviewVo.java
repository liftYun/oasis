package org.muhan.oasis.reservation.vo.out;
import java.math.BigInteger;

public class CancellationPreviewVo {
    private String tier; // 환불 정책 등급
    private BigInteger guestAmount; // 게스트에게 돌아갈 금액
    private BigInteger hostAmount;  // 호스트에게 돌아갈 금액
    private BigInteger guestFee;
    private BigInteger treasuryFee; // 서비스 수수료
}
