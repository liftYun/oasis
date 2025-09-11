//package org.muhan.oasis.circle.service;
//
//import lombok.RequiredArgsConstructor;
//import org.bouncycastle.bcpg.ArmoredOutputStream;
//import org.bouncycastle.openpgp.*;
//import org.bouncycastle.openpgp.jcajce.JcaPGPObjectFactory;
//import org.bouncycastle.openpgp.operator.jcajce.JcePGPDataEncryptorBuilder;
//import org.bouncycastle.openpgp.operator.jcajce.JcePublicKeyKeyEncryptionMethodGenerator;
//import org.muhan.oasis.circle.dto.*;
//import org.muhan.oasis.circle.vo.CreateWalletRequest;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.http.HttpStatus;
//import org.springframework.stereotype.Service;
//import org.springframework.web.reactive.function.client.WebClient;
//import org.springframework.web.reactive.function.client.WebClientResponseException;
//
//import java.io.ByteArrayInputStream;
//import java.io.ByteArrayOutputStream;
//import java.io.InputStream;
//import java.io.OutputStream;
//import java.nio.charset.StandardCharsets;
//import java.security.SecureRandom;
//import java.util.List;
//import java.util.UUID;
//
//
//@Service
//@RequiredArgsConstructor
//public class CircleService {
//
//    private final WebClient circleWebClient;
//
//    @Value("${circle.entity-secret}")
//    private String entitySecret;
//
//    public CircleSingleResponse<CircleWallet> createWallet(CreateWalletRequest createWalletRequest) {
//        // 실제 유저 ID를 사용해야 하지만, 테스트를 위해 UUID를 사용합니다.
//        String currentUserId = UUID.randomUUID().toString();
//
//        try {
//            List<String> SUPPORTED_BLOCKCHAINS = List.of("ETH-SEPOLIA", "MATIC-AMOY");
//
//            // entitySecretCiphertext가 없는 간단한 요청 DTO를 사용합니다.
//            CreateWalletApiRequest apiRequest = CreateWalletApiRequest.builder()
//                    .idempotencyKey(createWalletRequest.getIdempotencyKey())
//                    .walletSetId(currentUserId)
//                    .blockchains(SUPPORTED_BLOCKCHAINS)
//                    .build();
//
//            // ✅ URI 경로를 '/wallets'로 변경합니다.
//            return circleWebClient.post()
//                    .uri("/wallets")
//                    .bodyValue(apiRequest)
//                    .retrieve()
//                    .bodyToMono(CircleSingleResponse.class)
//                    .block();
//        } catch (WebClientResponseException e) {
//            throw new CircleUpstreamException((HttpStatus) e.getStatusCode(), e.getResponseBodyAsString(), e);
//        }
//    }
//    private EncryptionPublicKey getEncryptionPublicKey() {
//        CircleSingleResponse<EncryptionPublicKey> response = circleWebClient.get()
//                .uri("/developer/encryption/publicKey")
//                .retrieve()
//                .bodyToMono(CircleSingleResponse.class)
//                .block();
//        return new EncryptionPublicKey(); // 이 부분은 실제 응답 구조에 맞게 수정 필요
//    }
//
//    private String encryptEntitySecret(String publicKeyPem, String plainText) throws Exception {
//        // Decode PEM-formatted key
//        InputStream decoderStream = PGPUtil.getDecoderStream(
//                new ByteArrayInputStream(publicKeyPem.getBytes(StandardCharsets.UTF_8))
//        );
//
//        // Parse PGP object
//        JcaPGPObjectFactory pgpFact = new JcaPGPObjectFactory(decoderStream);
//        Object obj = pgpFact.nextObject();
//
//        PGPPublicKey pgpPublicKey;
//        if (obj instanceof PGPPublicKey) {
//            pgpPublicKey = (PGPPublicKey) obj;
//        } else {
//            throw new IllegalArgumentException("Not a valid PGP public key");
//        }
//
//        // Set up encryption generator
//        PGPEncryptedDataGenerator encryptedDataGenerator = new PGPEncryptedDataGenerator(
//                new JcePGPDataEncryptorBuilder(PGPEncryptedData.AES_256)
//                        .setWithIntegrityPacket(true)
//                        .setSecureRandom(new SecureRandom())
//        );
//        encryptedDataGenerator.addMethod(new JcePublicKeyKeyEncryptionMethodGenerator(pgpPublicKey));
//
//        // Set up output stream
//        ByteArrayOutputStream encryptedOut = new ByteArrayOutputStream();
//        OutputStream armoredOut = new ArmoredOutputStream(encryptedOut);
//
//        // Compress + encrypt literal data
//        PGPLiteralDataGenerator literalDataGenerator = new PGPLiteralDataGenerator();
//        byte[] plainTextBytes = plainText.getBytes(StandardCharsets.UTF_8);
//        OutputStream literalOut = literalDataGenerator.open(
//                armoredOut, PGPLiteralData.BINARY, "data", plainTextBytes.length, new java.util.Date()
//        );
//        literalOut.write(plainTextBytes);
//        literalOut.close();
//        armoredOut.close();
//
//        return encryptedOut.toString(StandardCharsets.UTF_8);
//    }
//
//    public CircleSingleResponse<CircleWallet> getWallet(String walletId) {
//        try {
//            return circleWebClient.get()
//                    .uri("/wallets/{id}", walletId)
//                    .retrieve()
//                    .bodyToMono(CircleSingleResponse.class)
//                    .block();
//        } catch (WebClientResponseException e) {
//            throw new CircleUpstreamException((HttpStatus) e.getStatusCode(), e.getResponseBodyAsString(), e);
//        }
//    }
//
//    public CirclePagedResponse<CircleBalance> getBalances(String walletId) {
//        try {
//            // 실제 엔드포인트가 /wallets/{id}/balances라면 그대로 사용
//            return circleWebClient.get()
//                    .uri("/wallets/{id}/balances", walletId)
//                    .retrieve()
//                    .bodyToMono(CirclePagedResponse.class)
//                    .block();
//        } catch (WebClientResponseException e) {
//            throw new CircleUpstreamException((HttpStatus) e.getStatusCode(), e.getResponseBodyAsString(), e);
//        }
//    }
//
//    // 공통 예외
//    public static class CircleUpstreamException extends RuntimeException {
//        private final HttpStatus status;
//        private final String body;
//
//        public CircleUpstreamException(HttpStatus status, String body, Throwable cause) {
//            super("Circle API error: " + status + " " + body, cause);
//            this.status = status;
//            this.body = body;
//        }
//
//        public HttpStatus getStatus() { return status; }
//        public String getBody() { return body; }
//    }
//
////    public PaymentInitResponse initializePayment(PaymentInitRequest req) {
////        // 1. 암호화를 위한 공개키 받아오기
////        EncryptionPublicKey publicKey = circleWebClient.get()
////                .uri("/encryption/public")
////                .retrieve()
////                .bodyToMono(EncryptionPublicKey.class) // DTO는 이전 것을 재사용하거나 새로 만듭니다.
////                .block();
////
////        // 2. 결제 생성 요청
////        // 이 요청으로 결제 ID가 생성됩니다.
////        PaymentCreationRequest apiRequest = PaymentCreationRequest.builder()
////                .idempotencyKey(UUID.randomUUID().toString())
////                .amount(new Amount(req.getAmount(), "USD")) // 금액과 통화
////                .source(new Source("card", "payment")) // 결제 수단
////                .description("Oasis Reservation Payment")
////                .build();
////
////        PaymentResponse paymentResponse = circleWebClient.post()
////                .uri("/payments")
////                .bodyValue(apiRequest)
////                .retrieve()
////                .bodyToMono(PaymentResponse.class) // DTO 새로 만들어야 함
////                .block();
////
////        // 3. 프론트엔드에 전달할 정보 조합
////        return new PaymentInitResponse(
////                paymentResponse.getData().getId(),
////                publicKey.getKeyId(),
////                publicKey.getPublicKey()
////        );
////    }
//
////    public CircleSingleResponse<CircleWallet> createWallet(CreateWalletRequest createWalletRequest) {
////        // 실제 유저 ID를 사용해야 하지만, 테스트를 위해 UUID를 사용합니다.
////        String currentUserId = UUID.randomUUID().toString();
////
////        try {
////            List<String> SUPPORTED_BLOCKCHAINS = List.of("ETH-SEPOLIA", "MATIC-AMOY");
////
////            // entitySecretCiphertext가 없는 간단한 요청 DTO를 사용합니다.
////            CreateWalletApiRequest apiRequest = CreateWalletApiRequest.builder()
////                    .idempotencyKey(createWalletRequest.getIdempotencyKey())
////                    .walletSetId(currentUserId)
////                    .blockchains(SUPPORTED_BLOCKCHAINS)
////                    .build();
////
////            // ✅ URI 경로를 '/wallets'로 변경합니다.
////            return circleWebClient.post()
////                    .uri("/wallets")
////                    .bodyValue(apiRequest)
////                    .retrieve()
////                    .bodyToMono(CircleSingleResponse.class)
////                    .block();
////        } catch (WebClientResponseException e) {
////            throw new CircleUpstreamException((HttpStatus) e.getStatusCode(), e.getResponseBodyAsString(), e);
////        }
////    }
//}
