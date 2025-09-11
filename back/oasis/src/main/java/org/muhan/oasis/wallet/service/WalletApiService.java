package org.muhan.oasis.wallet.service;

import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.muhan.oasis.wallet.dto.CircleSdkInitData;
import org.muhan.oasis.wallet.dto.WalletInfo;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import org.muhan.oasis.wallet.dto.CircleApiDto;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Slf4j
@Service
public class WalletApiService {

    private final WebClient webClient;
    private final String circleApiKey;
    private String cachedAppId; // App ID는 한번만 호출 후 캐싱

    public WalletApiService(@Value("${circle.base-url}") String baseUrl,
                            @Value("${circle.api-key}") String apiKey) {
        this.circleApiKey = apiKey;
        this.webClient = WebClient.builder()
                .baseUrl(baseUrl)
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .defaultHeader(HttpHeaders.AUTHORIZATION, "Bearer " + circleApiKey)
                .build();
    }

    // 서버 시작 시 App ID를 가져와 캐싱
    @PostConstruct
    public void init() {
        log.info("▶️ [INIT] Spring Boot 시작 시 Circle App ID 가져오기를 시작합니다...");
        try {
            this.cachedAppId = fetchAppId().block(); // block()을 사용하여 동기적으로 값을 가져옴
            if (this.cachedAppId != null) {
                log.info("✅ [INIT] Circle App ID 캐싱 성공! cachedAppId = {}", this.cachedAppId);
            } else {
                log.error("❌ [INIT] Circle App ID를 가져왔지만 값이 null입니다.");
            }
        } catch (Exception e) {
            log.error("❌ [INIT] Circle App ID 가져오기 실패! API Key나 네트워크 연결을 확인하세요.", e);
            // 애플리케이션 시작을 중단시키기 위해 예외를 다시 던짐
            throw new RuntimeException("CircleApiService 초기화 실패: App ID를 가져올 수 없습니다.", e);
        }
    }

//    public Mono<CircleSdkInitData> createAndInitializeWallet(UUID userId) {
//        log.info("▶️ [START] 지갑 생성 프로세스를 시작합니다. userId = {}", userId);
//
//        // 1. 사용자 생성 API 호출
//        return createUser(userId)
//                .doOnSuccess(aVoid -> log.info("✅ [STEP 1] 사용자 생성 성공. userId = {}", userId))
//                .doOnError(error -> log.error("❌ [STEP 1] 사용자 생성 실패! userId = {}", userId, error))
//                // then()을 사용해 이전 결과를 무시하고 다음 Mono를 실행
//                .then(
//                        // 2. 사용자 토큰 발급 API 호출
//                        issueUserToken(userId)
//                                .doOnSuccess(tokenResponse -> {
//                                    if (tokenResponse != null && tokenResponse.getData() != null) {
//                                        log.info("✅ [STEP 2] 사용자 토큰 발급 성공. userToken 길이 = {}, encryptionKey 길이 = {}",
//                                                tokenResponse.getData().getUserToken().length(),
//                                                tokenResponse.getData().getEncryptionKey().length());
//                                    } else {
//                                        log.warn("⚠️ [STEP 2] 사용자 토큰 응답이 비어있습니다.");
//                                    }
//                                })
//                                .doOnError(error -> log.error("❌ [STEP 2] 사용자 토큰 발급 실패! userId = {}", userId, error))
//                )
//                // flatMap()을 사용해 이전 Mono(토큰 발급)의 결과를 받아 다음 Mono(사용자 초기화)를 실행
//                .flatMap(tokenResponse -> {
//                    String userToken = tokenResponse.getData().getUserToken();
//                    String encryptionKey = tokenResponse.getData().getEncryptionKey();
//                    log.info("▶️ [STEP 3] 사용자 초기화(지갑 생성)를 시작합니다...");
//
//                    // 3. 사용자 초기화 (지갑 생성) API 호출
//                    return initializeUser(userToken)
//                            .doOnSuccess(initResponse -> {
//                                if (initResponse != null && initResponse.getData() != null) {
//                                    log.info("✅ [STEP 3] 사용자 초기화 성공. challengeId = {}", initResponse.getData().getChallengeId());
//                                } else {
//                                    log.warn("⚠️ [STEP 3] 사용자 초기화 응답이 비어있습니다.");
//                                }
//                            })
//                            .doOnError(error -> log.error("❌ [STEP 3] 사용자 초기화 실패!", error))
//                            // map()을 사용해 최종 결과를 프론트엔드에 전달할 DTO로 변환
//                            .map(initResponse -> {
//                                log.info("▶️ [FINISH] 프론트엔드로 전달할 최종 데이터(CircleSdkInitData)를 조립합니다...");
//                                CircleSdkInitData finalData = CircleSdkInitData.builder()
//                                        .appId(this.cachedAppId)
//                                        .userToken(userToken)
//                                        .encryptionKey(encryptionKey)
//                                        .challengeId(initResponse.getData().getChallengeId())
//                                        .build();
//                                log.info("✅ [FINISH] 최종 데이터 조립 완료!");
//                                return finalData;
//                            });
//                });
//    }


    public Mono<CircleSdkInitData> createAndInitializeWallet(UUID userId) {
        log.info("▶️ [START] Init session with branching. userId={}", userId);

        // 1) ensure user (존재하면 409 → 무시)
        return createUser(userId)
                .onErrorResume(ex -> {
                    // 409 등 '이미 존재' 에러를 무시하고 계속 진행
                    log.warn("⚠️ createUser warning (may already exist): {}", ex.getMessage());
                    return Mono.empty();
                })
                .then(issueUserToken(userId)) // 2) userToken 발급
                .flatMap(tokenResp -> {
                    final String userToken = tokenResp.getData().getUserToken();
                    final String encryptionKey = tokenResp.getData().getEncryptionKey();

                    // 3) 지갑 목록 조회
                    return listWallets(userToken).flatMap(wallets -> {
                        if (wallets.isEmpty()) {
                            // --- 신규 사용자: initialize → challengeId 발급 ---
                            log.info("No wallets found. Initializing user (SCA on MATIC-AMOY) ...");
                            return initializeUser(userToken)
                                    .map(init -> CircleSdkInitData.builder()
                                            .appId(this.cachedAppId)
                                            .userToken(userToken)
                                            .encryptionKey(encryptionKey)
                                            .challengeId(init.getData().getChallengeId()) // 프론트에서 sdk.execute()
                                            .build()
                                    );
                        } else {
                            // --- 기존 사용자: 1개 선택 + (선택) 잔액 조회 ---
                            WalletInfo primary = pickPrimary(wallets); // 정책에 맞게 고르기 (여기선 첫 번째)
                            return getBalances(userToken, primary.getId())
                                    .defaultIfEmpty(Map.of())
                                    .map(balances -> CircleSdkInitData.builder()
                                            .appId(this.cachedAppId)
                                            .userToken(userToken)
                                            .encryptionKey(encryptionKey)
                                            .wallets(wallets)
                                            .primaryWallet(primary)
                                            .balances(balances) // 예: {"USDC": "10"}
                                            // challengeId는 null → 프론트는 바로 사용
                                            .build()
                                    );
                        }
                    });
                });
    }


    private Mono<String> fetchAppId() {
        log.info("  [API CALL] GET /config/entity (App ID 요청)");
        return this.webClient.get()
                .uri("/config/entity")
                .retrieve()
                .bodyToMono(CircleApiDto.AppIdResponse.class)
                .map(response -> response.getData().getAppId());
    }

    private Mono<Void> createUser(UUID userId) {
        log.info("  [API CALL] POST /users (사용자 생성 요청), userId = {}", userId);
        Map<String, String> body = Map.of("userId", userId.toString());
        return this.webClient.post()
                .uri("/users")
                .bodyValue(body)
                .retrieve()
                .bodyToMono(Void.class);
    }

    private Mono<CircleApiDto.UserTokenResponse> issueUserToken(UUID userId) {
        log.info("  [API CALL] POST /users/token (사용자 토큰 요청), userId = {}", userId);
        Map<String, String> body = Map.of("userId", userId.toString());
        return this.webClient.post()
                .uri("/users/token")
                .bodyValue(body)
                .retrieve()
                .bodyToMono(CircleApiDto.UserTokenResponse.class);
    }

    private Mono<CircleApiDto.InitializeUserResponse> initializeUser(String userToken) {
        log.info("  [API CALL] POST /user/initialize (사용자 초기화 요청)");
        Map<String, Object> body = Map.of(
                "idempotencyKey", UUID.randomUUID().toString(),
                "accountType", "SCA",
                "blockchains", List.of("MATIC-AMOY")
        );
        return this.webClient.post()
                .uri("/user/initialize")
                .header("X-User-Token", userToken) // User Token 헤더 추가
                .bodyValue(body)
                .retrieve()
                .bodyToMono(CircleApiDto.InitializeUserResponse.class);
    }

    private Mono<List<WalletInfo>> listWallets(String userToken) {
        return this.webClient.get()
                .uri("/wallets")
                .header("X-User-Token", userToken)
                .retrieve()
                .bodyToMono(CircleApiDto.WalletListResponse.class)
                .map(resp -> resp.getData().getWallets().stream()
                        .map(w -> WalletInfo.builder()
                                .id(w.getId())
                                .address(w.getAddress())
                                .blockchain(w.getBlockchain())
                                .build())
                        .toList());
    }

    private WalletInfo pickPrimary(List<WalletInfo> wallets) {
        // 정책에 맞게 선택(여기서는 첫번째)
        return wallets.get(0);
    }

    private Mono<Map<String, String>> getBalances(String userToken, String walletId) {
        return this.webClient.get()
                .uri("/wallets/{id}/balances", walletId)
                .header("X-User-Token", userToken)
                .retrieve()
                .bodyToMono(CircleApiDto.BalanceResponse.class)
                .map(resp -> {
                    // USDC 위주로 깔끔히 매핑 (필요시 토큰 전부 매핑)
                    Map<String, String> out = new HashMap<>();
                    for (var tb : resp.getData().getTokenBalances()) {
                        var t = tb.getToken();
                        if ("USDC".equalsIgnoreCase(t.getSymbol())) {
                            out.put("USDC", tb.getAmount()); // 필요시 소수점/decimals 맞춰 format
                        }
                    }
                    return out;
                });
    }

    // CircleApiService.java (하단에 추가)
    public Mono<org.muhan.oasis.wallet.dto.WalletSnapshot> getWallet(UUID userId) {
        // 1) userToken 발급 (항상 안전; 멱등)
        return issueUserToken(userId)
                .flatMap(tok -> {
                    final String userToken = tok.getData().getUserToken();

                    // 2) 지갑 목록
                    return listWallets(userToken).flatMap(wallets -> {
                        if (wallets == null || wallets.isEmpty()) {
                            // 아직 지갑이 없으면 빈 스냅샷 반환 (혹은 404로 처리)
                            return Mono.just(
                                    org.muhan.oasis.wallet.dto.WalletSnapshot.builder()
                                            .primaryWallet(null)
                                            .wallets(List.of())
                                            .balances(Map.of())
                                            .build()
                            );
                        }

                        // 3) 대표 지갑 선택 + 잔액 조회
                        WalletInfo primary = pickPrimary(wallets);
                        return getBalances(userToken, primary.getId())
                                .defaultIfEmpty(Map.of())
                                .map(balances ->
                                        org.muhan.oasis.wallet.dto.WalletSnapshot.builder()
                                                .primaryWallet(primary)
                                                .wallets(wallets)
                                                .balances(balances)
                                                .build()
                                );
                    });
                });
    }


}
