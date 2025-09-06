package org.muhan.oasis.reservation.vo.in;

import lombok.Getter;

import java.math.BigInteger;

@Getter
public class ExecuteReservationRequestVo {
    private String guestAddress;
    private String hostAddress;
    private BigInteger payment;        // USDC (6dec)
    private BigInteger fee;            // USDC (6dec)
    private Long checkInTimestamp;
    private Long checkOutTimestamp;

    // PolicySnap
    private long  policyBefore1;
    private long  policyBefore2;
    private int   policyAmtPct1;
    private int   policyAmtPct2;
    private int   policyAmtPct3;
    private int   policyFeePct1;
    private int   policyFeePct2;
    private int   policyFeePct3;
}
