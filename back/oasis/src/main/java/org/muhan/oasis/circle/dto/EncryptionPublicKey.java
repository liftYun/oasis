package org.muhan.oasis.circle.dto;

import lombok.Getter;
import lombok.Setter;

// 공개키 응답을 받기 위한 DTO
@Getter
@Setter
public class EncryptionPublicKey {
    private String keyId;
    private String publicKey; // PEM 형식의 공개키
}