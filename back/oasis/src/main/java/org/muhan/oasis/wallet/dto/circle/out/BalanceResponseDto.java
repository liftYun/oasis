package org.muhan.oasis.wallet.dto.circle.out;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

import java.util.List;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class BalanceResponseDto {
    private Data data;
    @lombok.Data @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Data {
        private List<TokenBalance> tokenBalances;
    }
    @lombok.Data @JsonIgnoreProperties(ignoreUnknown = true)
    public static class TokenBalance {
        private Token token;
        private String amount; // 문자열
        private String updateDate;
    }
    @lombok.Data @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Token {
        private String id;
        private String blockchain;
        private String tokenAddress;
        private String standard; // ERC20
        private String name;     // USDC
        private String symbol;   // USDC
        private Integer decimals;
        private Boolean isNative;
    }
}
