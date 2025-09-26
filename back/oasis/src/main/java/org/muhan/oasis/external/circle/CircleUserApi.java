package org.muhan.oasis.external.circle;

import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.Map;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class CircleUserApi {

    private final @Qualifier("circleWebClient") WebClient circleWebClient;
    private final CircleUserTokenCache cache;

    public CircleUserTokenCache.Entry ensureUserToken(String userId) {
        CircleUserTokenCache.Entry cached = cache.get(userId);
        if (cached != null) {
            return cached;
        }

        UserTokenResponse resp = circleWebClient.post()
                .uri("/users/token")
                .bodyValue(Map.of("userId", userId))
                .retrieve()
                .onStatus(
                        status -> status.isError(), // 상태 코드 판별
                        response -> response.bodyToMono(String.class)
                                .flatMap(body -> Mono.error(new RuntimeException("Create user token failed: " + body)))
                )
                .bodyToMono(UserTokenResponse.class)
                .block();


        CircleUserTokenCache.Entry entry = new CircleUserTokenCache.Entry(resp.data.userToken, resp.data.encryptionKey, null);
        cache.put(userId, resp.data.userToken, resp.data.encryptionKey);
        return cache.get(userId);
    }

    public ContractExecChallenge createContractExecChallenge(
            String userToken,
            String walletId,
            String contractAddress,
            String callData,
            String feeLevel,
            String refId
    ) {
        Map<String, String> body = Map.of(
                "walletId", walletId,
                "contractAddress", contractAddress,
                "idempotencyKey", UUID.randomUUID().toString(),
                "callData", callData,
                "feeLevel", feeLevel,
                "refId", refId
        );

        return circleWebClient.post()
                .uri("/user/transactions/contractExecution")
                .header("X-User-Token", userToken)
                .bodyValue(body)
                .retrieve()
                .onStatus(
                        status -> status.isError(), // 상태 코드 판별
                        response -> response.bodyToMono(String.class)
                                .flatMap(respBody -> Mono.error(new RuntimeException("Create user token failed: " + body)))
                )
                .bodyToMono(ContractExecChallenge.class)
                .block();
    }

    @Data
    private static class UserTokenResponse {
        private DataNode data;
        @Data
        private static class DataNode {
            private String userToken;
            private String encryptionKey;
        }
    }

    @Data
    public static class ContractExecChallenge {
        private DataNode data;
        @Data
        public static class DataNode {
            private String challengeId;
        }
    }

    public static class CircleApiException extends RuntimeException {
        public final int status;
        public final String body;
        public CircleApiException(int status, String body) {
            super("Circle error: HTTP " + status + " - " + body);
            this.status = status;
            this.body = body;
        }
    }
}