package org.muhan.oasis.reservation.vo.in;

import lombok.*;
import java.math.BigInteger;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class RecordReservationRequest {
    private String txHash;          // "0x" + 64
    private String resId;           // "0x" + 64
    private BigInteger amount;      // USDC 6dec
    private long checkInTimestamp;  // seconds
    private long checkOutTimestamp; // seconds
    private String guestAddress;    // (선택) 저장 원하면 엔티티 확장
    private String hostAddress;     // (선택)
}
