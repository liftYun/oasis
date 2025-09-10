package org.muhan.oasis.wallet.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

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
}
