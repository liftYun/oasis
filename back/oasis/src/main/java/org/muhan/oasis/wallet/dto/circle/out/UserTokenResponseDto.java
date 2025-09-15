package org.muhan.oasis.wallet.dto.circle.out;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class UserTokenResponseDto {
    private Data data;
    @lombok.Data @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Data {
        private String userToken;
        private String encryptionKey;
    }
}
