package org.muhan.oasis.wallet.dto.out;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class WalletInfoResponseDto {
    private String id;
    private String address;
    private String blockchain; // 예: "MATIC-AMOY"
}