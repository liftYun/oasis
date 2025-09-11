package org.muhan.oasis.circle.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateWalletApiRequest {
    private String idempotencyKey;   // 프론트에서 받은 값
    private String walletSetId;      // 서버에서 관리하는 값 (ex: userId 기반)
    private List<String> blockchains; // 서버에서 정해둔 지원 네트워크
}