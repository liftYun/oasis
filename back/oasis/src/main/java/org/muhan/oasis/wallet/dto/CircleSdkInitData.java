package org.muhan.oasis.wallet.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CircleSdkInitData {
    private String appId;
    private String userToken;
    private String encryptionKey;
    private String challengeId;
}
