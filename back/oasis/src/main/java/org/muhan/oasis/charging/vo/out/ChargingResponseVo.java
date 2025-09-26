package org.muhan.oasis.charging.vo.out;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
public class ChargingResponseVo {
    private String txHash;
    private BigDecimal usdc;
}
