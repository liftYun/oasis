package org.muhan.oasis.reservation.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class CancelReservationTxService {

    private final @Qualifier("circleWebClient") WebClient circleWebClient;

    public String createCancelTx(String userId, String walletId, String contractAddress,
                                 String callData, String userToken, String idempotencyKey) {
        // 요청 Body 구성 (명확히 타입 지정)
        Map<String, Object> body = new HashMap<>();
        body.put("walletId", walletId);
        body.put("contractAddress", contractAddress);
        body.put("callData", callData);
        body.put("idempotencyKey", idempotencyKey);
        body.put("feeLevel", "MEDIUM");

        log.info("[CancelReservationTxService] userId={}, walletId={}, contract={}, callData={}",
                userId, walletId, contractAddress, callData);

        // Circle API 호출
        Map resp = circleWebClient.post()
                .uri("/user/transactions/contractExecution")
                .header("X-User-Token", userToken)
                .bodyValue(body)
                .retrieve()
                .onStatus(HttpStatusCode::isError, r -> r.bodyToMono(String.class)
                        .flatMap(msg -> Mono.error(
                                new RuntimeException("circle error: " + r.statusCode() + " - " + msg)
                        )))
                .bodyToMono(Map.class)   // raw Map 반환
                .block();

        if (resp == null) {
            throw new RuntimeException("❌ Circle API 응답이 null입니다.");
        }

        @SuppressWarnings("unchecked")
        Map<String, Object> data = (Map<String, Object>) resp.get("data");

        if (data == null || data.get("challengeId") == null) {
            throw new RuntimeException("❌ missing challengeId: " + resp);
        }

        String challengeId = data.get("challengeId").toString();
        log.info("[CancelReservationTxService] ✅ challengeId={}", challengeId);

        return challengeId;
    }
}
