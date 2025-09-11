package org.muhan.oasis.circle;

import lombok.RequiredArgsConstructor;
import org.muhan.oasis.booking.CircleClient;
import org.muhan.oasis.booking.UserSessionStore;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.*;

@Service
@RequiredArgsConstructor
public class CircleAuthService {

    private final CircleClient circleClient;       // appClient()/userClient()
    private final UserSessionStore sessionStore;

    /** 세션이 없으면 users/token → wallets 로 즉시 만들어 저장 후 반환 */
    public UserSessionStore.Session getOrCreateSession(String userId) {
        var ses = sessionStore.get(userId);
        if (ses != null) return ses;

        // 1) userToken 발급
        Map<String, Object> tokenResp = circleClient.appClient().post()
                .uri("/users/token")
                .bodyValue(Map.of("userId", userId))
                .retrieve()
                .onStatus(HttpStatusCode::isError, r -> r.bodyToMono(String.class)
                        .flatMap(msg -> Mono.error(new RuntimeException("users/token error: " + r.statusCode() + " - " + msg))))
                .bodyToMono(Map.class)
                .block();

        Map data = (Map) tokenResp.get("data");
        if (data == null || data.get("userToken") == null) {
            throw new RuntimeException("users/token missing userToken: " + tokenResp);
        }
        String userToken = data.get("userToken").toString();

        // 2) 사용자 지갑 조회 (필요 체인 우선 선택; 없으면 첫 지갑)
        Map walletsResp = circleClient.userClient(userToken).get()
                .uri(uriBuilder -> uriBuilder
                        .path("/wallets")
                        .queryParam("blockchain", "MATIC-AMOY") // Polygon Amoy 우선
                        .build())
                .retrieve()
                .onStatus(HttpStatusCode::isError, r -> r.bodyToMono(String.class)
                        .flatMap(msg -> Mono.error(new RuntimeException("GET /wallets error: " + r.statusCode() + " - " + msg))))
                .bodyToMono(Map.class)
                .block();

        String walletId = extractFirstWalletId(walletsResp);
        if (walletId == null) {
            // 체인 필터로 못 찾았으면 전체 지갑 재시도
            Map allResp = circleClient.userClient(userToken).get()
                    .uri("/wallets")
                    .retrieve()
                    .onStatus(HttpStatusCode::isError, r -> r.bodyToMono(String.class)
                            .flatMap(msg -> Mono.error(new RuntimeException("GET /wallets(all) error: " + r.statusCode() + " - " + msg))))
                    .bodyToMono(Map.class)
                    .block();
            walletId = extractFirstWalletId(allResp);
        }
        if (walletId == null) {
            throw new IllegalStateException("no user wallet found. create a wallet first.");
        }

        var created = new UserSessionStore.Session(userToken, walletId);
        sessionStore.put(userId, created);
        return created;
    }

    @SuppressWarnings("unchecked")
    private String extractFirstWalletId(Map resp) {
        if (resp == null) return null;
        Map data = (Map) resp.get("data");
        if (data == null) return null;
        Object w = data.get("wallets");
        if (w instanceof List<?> list && !list.isEmpty()) {
            Object first = list.get(0);
            if (first instanceof Map<?,?> m && m.get("id") != null) {
                return m.get("id").toString();
            }
        }
        return null;
    }
}
