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

import java.time.Duration;
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

    public InitWalletResponseVo createAndInitializeWalletSync(String userId) {
        log.info("▶️ [START] Init session with sync processing. userId={}", userId);

        try {
            // 1) ensure user (존재하면 409 → 무시하고 계속 진행)
            try {
                createUser(userId).block(Duration.ofSeconds(10));
            } catch (Exception ex) {
                log.warn("⚠️ createUser warning (may already exist): {}", ex.getMessage());
                // 409 등 '이미 존재' 에러는 무시하고 계속 진행
            }

            // 2) userToken 발급
            UserTokenResponseDto tokenResp = issueUserToken(userId).block(Duration.ofSeconds(10));
            if (tokenResp == null || tokenResp.getData() == null) {
                throw new RuntimeException("UserToken 발급 실패: 응답이 null입니다.");
            }

            final String userToken = tokenResp.getData().getUserToken();
            final String encryptionKey = tokenResp.getData().getEncryptionKey();

            // 3) 지갑 목록 조회
            List<WalletInfoResponseDto> wallets = listWallets(userToken).block(Duration.ofSeconds(10));
            if (wallets == null) {
                wallets = List.of(); // null 방어
            }

            if (wallets.isEmpty()) {
                log.info("No wallets found. Initializing user (SCA on MATIC-AMOY) ...");

                // 신규 사용자: 초기화 실행
                InitializeUserResponseDto initResp = initializeUser(userToken).block(Duration.ofSeconds(15));
                if (initResp == null || initResp.getData() == null) {
                    throw new RuntimeException("User 초기화 실패: 응답이 null입니다.");
                }

                log.info("✅ /user/initialize 응답 수신: challengeId = {}", initResp.getData().getChallengeId());
                log.info("✅ InitWalletResponse 생성 (신규 사용자): appId={}, challengeId={}",
                        cachedAppId, initResp.getData().getChallengeId());

                return InitWalletResponseVo.builder()
                        .appId(cachedAppId)
                        .userToken(userToken)
                        .encryptionKey(encryptionKey)
                        .challengeId(initResp.getData().getChallengeId()) // 프론트에서 sdk.execute()
                        .build();

            } else {
                // 기존 사용자: 지갑 정보 + 잔액 조회
                WalletInfoResponseDto primary = pickPrimary(wallets);
                log.info("🔡 getBalances 시작: walletId={}", primary.getId());

                Map<String, String> balances = getBalances(userToken, primary.getId())
                        .block(Duration.ofSeconds(10));

                if (balances == null) {
                    balances = Map.of("USDC", "0.00"); // 기본값 설정
                    log.warn("⚠️ balances 조회 실패, 기본값으로 설정");
                } else {
                    log.info("✅ 잔액 조회 성공: USDC={}", balances.get("USDC"));
                }

                log.info("✅ InitWalletResponse 생성 (기존 사용자)");

                InitWalletResponseVo resp = InitWalletResponseVo.builder()
                        .appId(cachedAppId)
                        .userToken(userToken)
                        .encryptionKey(encryptionKey)
                        .wallets(wallets)
                        .primaryWallet(primary)
                        .balances(balances)
                        .build();

                log.info("📤 최종 InitWalletResponse 생성 완료: {}", resp);
                return resp;
            }

        } catch (Exception e) {
            log.error("❌ createAndInitializeWalletSync 처리 중 예외 발생", e);

            // 구체적인 에러 메시지 제공
            if (e.getCause() instanceof java.util.concurrent.TimeoutException) {
                throw new RuntimeException("Circle API 호출 시간 초과", e);
            } else if (e.getMessage().contains("401") || e.getMessage().contains("403")) {
                throw new RuntimeException("Circle API 인증 실패", e);
            } else if (e.getMessage().contains("404")) {
                throw new RuntimeException("Circle API 리소스를 찾을 수 없습니다", e);
            } else {
                throw new RuntimeException("지갑 초기화 처리 중 오류가 발생했습니다: " + e.getMessage(), e);
            }
        }
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



    public WalletSnapshotResponseDto getWalletSync(String userId) {
        log.info("🔍 [START] Get wallet sync processing. userId={}", userId);

        try {
            // 1) userToken 발급 (항상 안전; 멱등)
            UserTokenResponseDto tokenResp = issueUserToken(userId).block(Duration.ofSeconds(10));
            if (tokenResp == null || tokenResp.getData() == null) {
                throw new RuntimeException("UserToken 발급 실패: 응답이 null입니다.");
            }

            final String userToken = tokenResp.getData().getUserToken();

            // 2) 지갑 목록 조회
            List<WalletInfoResponseDto> wallets = listWallets(userToken).block(Duration.ofSeconds(10));
            if (wallets == null) {
                wallets = List.of(); // null 방어
            }

            if (wallets.isEmpty()) {
                // 아직 지갑이 없으면 빈 스냅샷 반환
                log.info("지갑이 없어서 빈 스냅샷 반환");
                return WalletSnapshotResponseDto.builder()
                        .primaryWallet(null)
                        .wallets(List.of())
                        .balances(Map.of())
                        .build();
            }

            // 3) 대표 지갑 선택 + 잔액 조회
            WalletInfoResponseDto primary = pickPrimary(wallets);
            log.info("🔡 잔액 조회 시작: walletId={}", primary.getId());

            Map<String, String> balances = getBalances(userToken, primary.getId())
                    .block(Duration.ofSeconds(10));

            if (balances == null) {
                balances = Map.of("USDC", "0.00"); // 기본값
                log.warn("잔액 조회 실패, 기본값 설정");
            } else {
                log.info("잔액 조회 성공: USDC={}", balances.get("USDC"));
            }

            WalletSnapshotResponseDto result = WalletSnapshotResponseDto.builder()
                    .primaryWallet(primary)
                    .wallets(wallets)
                    .balances(balances)
                    .build();

            log.info("지갑 조회 완료: 지갑 {}개, 주소={}", wallets.size(), primary.getAddress());
            return result;

        } catch (Exception e) {
            log.error("getWalletSync 처리 중 예외 발생", e);

            // 구체적인 에러 메시지 제공
            if (e.getCause() instanceof java.util.concurrent.TimeoutException) {
                throw new RuntimeException("Circle API 호출 시간 초과", e);
            } else if (e.getMessage().contains("401") || e.getMessage().contains("403")) {
                throw new RuntimeException("Circle API 인증 실패", e);
            } else if (e.getMessage().contains("404")) {
                throw new RuntimeException("Circle API 리소스를 찾을 수 없습니다", e);
            } else {
                throw new RuntimeException("지갑 조회 중 오류가 발생했습니다: " + e.getMessage(), e);
            }
        }
    }

}
