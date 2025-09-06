package org.muhan.oasis.reservation.dto.out;

import lombok.Data;

import java.math.BigInteger;

@Data
public class BookingResponse {
    private String resIdHex;
    private String guest;
    private String host;
    private String amount; // "10.000000 USDC"
    private String fee;    // "1.000000 USDC"
    private BigInteger amountRaw;
    private BigInteger feeRaw;
    private BigInteger checkIn;
    private BigInteger checkOut;
    private BigInteger status; // 0 None, 1 Locked, 2 Released, 3 Refunded
    private Policy policy;

    @Data
    public static class Policy {
        private BigInteger before1, before2;
        private BigInteger amtPct1, amtPct2, amtPct3;
        private BigInteger feePct1, feePct2, feePct3;
    }
}
