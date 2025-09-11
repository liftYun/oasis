package org.muhan.oasis.wallet.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

import java.util.List;

// 여러 Circle API 응답을 처리하기 위한 중첩 클래스 DTO
public class CircleApiDto {

    @Data @JsonIgnoreProperties(ignoreUnknown = true)
    public static class UserTokenResponse {
        private Data data;
        @lombok.Data @JsonIgnoreProperties(ignoreUnknown = true)
        public static class Data {
            private String userToken;
            private String encryptionKey;
        }
    }

    @Data @JsonIgnoreProperties(ignoreUnknown = true)
    public static class InitializeUserResponse {
        private Data data;
        @lombok.Data @JsonIgnoreProperties(ignoreUnknown = true)
        public static class Data {
            private String challengeId;
        }
    }

    @Data @JsonIgnoreProperties(ignoreUnknown = true)
    public static class AppIdResponse {
        private Data data;
        @lombok.Data @JsonIgnoreProperties(ignoreUnknown = true)
        public static class Data {
            private String appId;
        }
    }

    // === 지갑 목록 ===
    @Data @JsonIgnoreProperties(ignoreUnknown = true)
    public static class WalletListResponse {
        private Data data;
        @lombok.Data @JsonIgnoreProperties(ignoreUnknown = true)
        public static class Data {
            private List<Wallet> wallets;
        }
        @lombok.Data @JsonIgnoreProperties(ignoreUnknown = true)
        public static class Wallet {
            private String id;
            private String address;
            private String blockchain; // "MATIC-AMOY" 등
            // 필요시 state, accountType 등 추가
        }
    }

    // === 잔액 ===
    @Data @JsonIgnoreProperties(ignoreUnknown = true)
    public static class BalanceResponse {
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
}
