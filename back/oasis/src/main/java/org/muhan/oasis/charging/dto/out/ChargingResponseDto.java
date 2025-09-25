package org.muhan.oasis.charging.dto.out;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
public class ChargingResponseDto {
    private String txHash;
    private BigDecimal usdc;
}
