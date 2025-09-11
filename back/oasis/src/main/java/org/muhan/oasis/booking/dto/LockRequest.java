package org.muhan.oasis.booking.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class LockRequest {
    private String userId;
    private String usdc;       // USDC address
    private String booking;    // NomadBooking address
    private String host;       // host address
    private String amountUSDC; // "100.00"
    private String feeUSDC;    // "3.00"
    private long checkIn;      // unix sec
    private long checkOut;     // unix sec
    private PolicySnap policy; // bps
    private String resId;      // optional (0x...32)
}
