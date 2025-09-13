package org.muhan.oasis.wallet.service;

import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.muhan.oasis.wallet.dto.circle.out.*;
import org.muhan.oasis.wallet.dto.out.WalletInfoResponseDto;
import org.muhan.oasis.wallet.vo.out.InitWalletResponseVo;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Slf4j
@Service
public class WalletService {

    private final WebClient webClient;
    private final String circleApiKey;
    private String cachedAppId; // App ID는 한번만 호출 후 캐싱

    public WalletService(@Value("${circle.base-url}") String baseUrl,
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

    public Mono<InitWalletResponseVo> createAndInitializeWallet(String userId) {
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
                            log.info("No wallets found. Initializing user (SCA on MATIC-AMOY) ...");

                            return initializeUser(userToken)
                                    .doOnNext(init -> log.info("✅ /user/initialize 응답 수신: challengeId = {}", init.getData().getChallengeId()))
                                    .map(init -> {
                                        log.info("✅ InitWalletResponse 생성 (신규 사용자): appId={}, challengeId={}", cachedAppId, init.getData().getChallengeId());
                                        return InitWalletResponseVo.builder()
                                                .appId(cachedAppId)
                                                .userToken(userToken)
                                                .encryptionKey(encryptionKey)
                                                .challengeId(init.getData().getChallengeId()) // 프론트에서 sdk.execute()
                                                .build();
                                    });

                        } else {
                            WalletInfoResponseDto primary = pickPrimary(wallets);
                            return getBalances(userToken, primary.getId())
                                    .doOnSubscribe(sub -> log.info("📡 getBalances 시작: walletId={}", primary.getId()))
                                    .doOnNext(balances -> {
                                        if (balances == null || balances.isEmpty()) {
                                            log.warn("⚠️ balances 응답이 비어 있음 (혹은 null)");
                                        } else {
                                            log.info("✅ 잔액 조회 성공: USDC={}", balances.get("USDC"));
                                        }
                                    })
                                    .map(balances -> {
                                        log.info("✅ InitWalletResponse 생성 (기존 사용자)");

                                        InitWalletResponseVo resp = InitWalletResponseVo.builder()
                                                .appId(cachedAppId)
                                                .userToken(userToken)
                                                .encryptionKey(encryptionKey)
                                                .wallets(wallets)
                                                .primaryWallet(primary)
                                                .balances(balances)
                                                .build();
                                        log.info("📤 최종 InitWalletResponse 직렬화 직전: {}", resp);
                                        return resp;
                                    })
                                    .onErrorResume(e -> {
                                        log.error("❌ getBalances 중 오류 발생", e);
                                        return Mono.error(e);
                                    });
                        }
                    });
                });
    }


    private Mono<String> fetchAppId() {
        log.info("  [API CALL] GET /config/entity (App ID 요청)");
        return this.webClient.get()
                .uri("/config/entity")
                .retrieve()
                .bodyToMono(AppIdResponseDto.class)
                .map(response -> response.getData().getAppId());
    }

    private Mono<Void> createUser(String userId) {
        log.info("  [API CALL] POST /users (사용자 생성 요청), userId = {}", userId);
        return this.webClient.post()
                .uri("/users")
                .bodyValue(Map.of("userId", userId)) // ✅ userId는 반드시 String
                .retrieve()
                .bodyToMono(Void.class);
    }

    private Mono<UserTokenResponseDto> issueUserToken(String userId) {
        log.info("  [API CALL] POST /users/token (사용자 토큰 요청), userId = {}", userId);
        return this.webClient.post()
                .uri("/users/token")
                .bodyValue(Map.of("userId", userId)) // ✅ 이 부분도 동일
                .retrieve()
                .bodyToMono(UserTokenResponseDto.class);
    }

    private Mono<InitializeUserResponseDto> initializeUser(String userToken) {
        log.info("  [API CALL] POST /user/initialize (사용자 초기화 요청)");
        if (userToken == null || userToken.isBlank()) {
            log.error("❌ userToken is null or blank! 초기화 요청 불가");
            return Mono.error(new RuntimeException("userToken is null or empty"));
        }

        log.info("🟢 userToken 전달: {}", userToken);  // 디버깅 로그
        Map<String, Object> body = Map.of(
                "idempotencyKey", UUID.randomUUID().toString(),
                "accountType", "SCA",
                "blockchains", List.of("MATIC-AMOY")
        );

        return this.webClient.post()
                .uri("/user/initialize")
                .header("X-User-Token", userToken)
                .bodyValue(body)
                .retrieve()
                .onStatus(
                        status -> status.isError(),  // 👈 이렇게 바꾸면 빨간 줄 안 뜸
                        resp -> resp.bodyToMono(String.class).map(bodyStr -> {
                            log.error("❌ Error from /user/initialize: status = {}, body = {}", resp.statusCode(), bodyStr);
                            return new RuntimeException("API Error: " + bodyStr);
                        })
                )
                .bodyToMono(InitializeUserResponseDto.class)
                .doOnNext(resp -> log.info("✅ /user/initialize 성공: challengeId = {}", resp.getData().getChallengeId()))
                .doOnError(err -> log.error("❌ /user/initialize 실패: {}", err.getMessage()));
    }


    private Mono<List<WalletInfoResponseDto>> listWallets(String userToken) {
        return this.webClient.get()
                .uri("/wallets")
                .header("X-User-Token", userToken)
                .retrieve()
                .bodyToMono(WalletListResponseDto.class)
                .map(resp -> resp.getData().getWallets().stream()
                        .map(w -> WalletInfoResponseDto.builder()
                                .id(w.getId())
                                .address(w.getAddress())
                                .blockchain(w.getBlockchain())
                                .build())
                        .toList());
    }

    private WalletInfoResponseDto pickPrimary(List<WalletInfoResponseDto> wallets) {
        // 첫 번째 지갑을 주 지갑으로
        return wallets.get(0);
    }

    private Mono<Map<String, String>> getBalances(String userToken, String walletId) {
        return this.webClient.get()
                .uri("/wallets/{id}/balances", walletId)
                .header("X-User-Token", userToken)
                .retrieve()
                .bodyToMono(BalanceResponseDto.class)
                .map(response -> {
                    Map<String, String> result = new HashMap<>();
                    result.put("USDC", "0.00");

                    List<BalanceResponseDto.TokenBalance> tokenBalances = response.getData().getTokenBalances();
                    if (tokenBalances == null || tokenBalances.isEmpty()) {
                        log.warn("⚠️ balances 응답이 비어 있음 (혹은 null)");
                        return result;
                    }
                    for (BalanceResponseDto.TokenBalance tokenBalance : tokenBalances) {
                        BalanceResponseDto.Token token = tokenBalance.getToken();
                        String symbol = token.getSymbol();
                        if ("USDC".equalsIgnoreCase(symbol)) {
                            String amount = tokenBalance.getAmount();
                            result.put("USDC", amount);
                        }
                    }

                    return result;
                });
    }



    public Mono<WalletSnapshotResponseDto> getWallet(String userId) {
        // 1) userToken 발급 (항상 안전; 멱등)
        return issueUserToken(userId)
                .flatMap(tok -> {
                    final String userToken = tok.getData().getUserToken();

                    // 2) 지갑 목록
                    return listWallets(userToken).flatMap(wallets -> {
                        if (wallets == null || wallets.isEmpty()) {
                            // 아직 지갑이 없으면 빈 스냅샷 반환
                            return Mono.just(
                                    WalletSnapshotResponseDto.builder()
                                            .primaryWallet(null)
                                            .wallets(List.of())
                                            .balances(Map.of())
                                            .build()
                            );
                        }

                        // 3) 대표 지갑 선택 + 잔액 조회
                        WalletInfoResponseDto primary = pickPrimary(wallets);
                        return getBalances(userToken, primary.getId())
                                .defaultIfEmpty(Map.of())
                                .map(balances ->
                                        WalletSnapshotResponseDto.builder()
                                                .primaryWallet(primary)
                                                .wallets(wallets)
                                                .balances(balances)
                                                .build()
                                );
                    });
                });
    }



}
