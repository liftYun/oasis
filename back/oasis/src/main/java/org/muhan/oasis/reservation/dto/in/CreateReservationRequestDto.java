package org.muhan.oasis.reservation.dto.in;

import lombok.*;
import java.math.BigInteger;

@Getter @Setter @Builder
@AllArgsConstructor @NoArgsConstructor
public class CreateReservationRequestDto {
    private String resId;                // 0x + 64 hex
    private String guestAddress;
    private String hostAddress;
    private BigInteger amount;
    private BigInteger fee;
    private long checkInTimestamp;
    private long checkOutTimestamp;

    private long  policyBefore1;
    private long  policyBefore2;
    private int   policyAmtPct1;
    private int   policyAmtPct2;
    private int   policyAmtPct3;
    private int   policyFeePct1;
    private int   policyFeePct2;
    private int   policyFeePct3;
}
