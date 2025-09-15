package org.muhan.oasis.wallet.dto.circle.out;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

import java.util.List;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class WalletListResponseDto {
    private Data data;
    @lombok.Data @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Data {
        private List<Wallet> wallets;
    }
    @lombok.Data @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Wallet {
        private String id;
        private String address;
        private String blockchain;
        // 필요시 state, accountType 등 추가
    }
}
