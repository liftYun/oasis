package org.muhan.oasis.circle.dto;

import lombok.Builder;
import lombok.Getter;
import java.util.List;

// Circle /developer/wallets API에 보낼 요청 DTO
@Getter
@Builder
public class CreateDeveloperWalletApiRequest {
    private String idempotencyKey;
    private String walletSetId;
    private List<String> blockchains;
    private String entitySecretCiphertext;
}