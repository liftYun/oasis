package org.muhan.oasis.circle.vo;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.util.List;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class CreateWalletRequest {
    @NotBlank
    private String idempotencyKey;

    // 필요 시 서버 측에서 기본값 세팅 가능
//    private String walletSetId;           // optional
//    private List<String> blockchains;     // e.g., ["ETH-SEPOLIA","MATIC-AMOY"]
}