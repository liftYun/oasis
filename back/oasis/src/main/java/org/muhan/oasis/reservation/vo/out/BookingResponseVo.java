package org.muhan.oasis.reservation.vo.out;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookingResponseVo {
    /** on-chain bytes32 (0x + 64) */
    private String resId;
    /** lock 트랜잭션 해시 (0x + 64) */
    private String txHash;
}