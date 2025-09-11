// src/main/java/org/muhan/oasis/circle/UserTransactionService.java
package org.muhan.oasis.circle;

import lombok.RequiredArgsConstructor;
import org.muhan.oasis.booking.CircleClient;
import org.muhan.oasis.booking.UserSessionStore;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.*;

@Service
@RequiredArgsConstructor
public class UserTransactionService {

    private final CircleClient circleClient;
    private final UserSessionStore sessionStore;

    public String createContractExecutionByCallData(
            String userId,
            String walletId,
            String contractAddress,
            String callData
    ) {
        var ses = sessionStore.get(userId);
        if (ses == null) throw new IllegalArgumentException("user session not found: " + userId);
        WebClient client = circleClient.userClient(ses.getUserToken());

        Map<String, Object> body = new HashMap<>();
        body.put("walletId", walletId);
        body.put("contractAddress", contractAddress);
        body.put("callData", callData);                     // 0x...
        body.put("idempotencyKey", UUID.randomUUID().toString());
        body.put("feeLevel", "MEDIUM");
        // 필요시: body.put("feeLevel", "MEDIUM"); body.put("amount", "0");

        Map resp = client.post()
                .uri("/user/transactions/contractExecution")
                .bodyValue(body)
                .retrieve()
                .onStatus(HttpStatusCode::isError, r -> r.bodyToMono(String.class)
                        .flatMap(msg -> Mono.error(new RuntimeException("circle error: " + r.statusCode() + " - " + msg))))
                .bodyToMono(Map.class)
                .block();

        Map data = (Map) resp.get("data");
        if (data == null || data.get("challengeId") == null) {
            throw new RuntimeException("missing challengeId: " + resp);
        }
        return data.get("challengeId").toString();
    }

    public String createContractExecutionByAbi(
            String userId,
            String walletId,
            String contractAddress,
            String abiFunctionSignature,
            List<Object> abiParameters
    ) {
        var ses = sessionStore.get(userId);
        if (ses == null) throw new IllegalArgumentException("user session not found: " + userId);
        WebClient client = circleClient.userClient(ses.getUserToken());

        Map<String, Object> body = new HashMap<>();
        body.put("walletId", walletId);
        body.put("contractAddress", contractAddress);
        body.put("abiFunctionSignature", abiFunctionSignature);
        body.put("abiParameters", abiParameters);           // ["0xspender", "1230000"]
        body.put("idempotencyKey", UUID.randomUUID().toString());
        body.put("feeLevel", "MEDIUM");

        Map resp = client.post()
                .uri("/user/transactions/contractExecution")
                .bodyValue(body)
                .retrieve()
                .onStatus(HttpStatusCode::isError, r -> r.bodyToMono(String.class)
                        .flatMap(msg -> Mono.error(new RuntimeException("circle error: " + r.statusCode() + " - " + msg))))
                .bodyToMono(Map.class)
                .block();

        Map data = (Map) resp.get("data");
        if (data == null || data.get("challengeId") == null) {
            throw new RuntimeException("missing challengeId: " + resp);
        }
        return data.get("challengeId").toString();
    }
}
