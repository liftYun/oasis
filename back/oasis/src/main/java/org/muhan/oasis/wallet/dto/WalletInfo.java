package org.muhan.oasis.wallet.dto;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class WalletInfo {
    private String id;
    private String address;
    private String blockchain; // 예: "MATIC-AMOY"
}