package org.muhan.oasis.wallet.service;

import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.muhan.oasis.wallet.dto.CircleSdkInitData;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import org.muhan.oasis.wallet.dto.CircleApiDto;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Slf4j
@Service
public class CircleApiService {

    private final WebClient webClient;
    private final String circleApiKey;
    private String cachedAppId; // App ID는 한번만 호출 후 캐싱

    public CircleApiService(@Value("${circle.api.url}") String baseUrl,
                            @Value("${circle.api.key}") String apiKey) {
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

    public Mono<CircleSdkInitData> createAndInitializeWallet(UUID userId) {
        log.info("▶️ [START] 지갑 생성 프로세스를 시작합니다. userId = {}", userId);

        // 1. 사용자 생성 API 호출
        return createUser(userId)
                .doOnSuccess(aVoid -> log.info("✅ [STEP 1] 사용자 생성 성공. userId = {}", userId))
                .doOnError(error -> log.error("❌ [STEP 1] 사용자 생성 실패! userId = {}", userId, error))
                // then()을 사용해 이전 결과를 무시하고 다음 Mono를 실행
                .then(
                        // 2. 사용자 토큰 발급 API 호출
                        issueUserToken(userId)
                                .doOnSuccess(tokenResponse -> {
                                    if (tokenResponse != null && tokenResponse.getData() != null) {
                                        log.info("✅ [STEP 2] 사용자 토큰 발급 성공. userToken 길이 = {}, encryptionKey 길이 = {}",
                                                tokenResponse.getData().getUserToken().length(),
                                                tokenResponse.getData().getEncryptionKey().length());
                                    } else {
                                        log.warn("⚠️ [STEP 2] 사용자 토큰 응답이 비어있습니다.");
                                    }
                                })
                                .doOnError(error -> log.error("❌ [STEP 2] 사용자 토큰 발급 실패! userId = {}", userId, error))
                )
                // flatMap()을 사용해 이전 Mono(토큰 발급)의 결과를 받아 다음 Mono(사용자 초기화)를 실행
                .flatMap(tokenResponse -> {
                    String userToken = tokenResponse.getData().getUserToken();
                    String encryptionKey = tokenResponse.getData().getEncryptionKey();
                    log.info("▶️ [STEP 3] 사용자 초기화(지갑 생성)를 시작합니다...");

                    // 3. 사용자 초기화 (지갑 생성) API 호출
                    return initializeUser(userToken)
                            .doOnSuccess(initResponse -> {
                                if (initResponse != null && initResponse.getData() != null) {
                                    log.info("✅ [STEP 3] 사용자 초기화 성공. challengeId = {}", initResponse.getData().getChallengeId());
                                } else {
                                    log.warn("⚠️ [STEP 3] 사용자 초기화 응답이 비어있습니다.");
                                }
                            })
                            .doOnError(error -> log.error("❌ [STEP 3] 사용자 초기화 실패!", error))
                            // map()을 사용해 최종 결과를 프론트엔드에 전달할 DTO로 변환
                            .map(initResponse -> {
                                log.info("▶️ [FINISH] 프론트엔드로 전달할 최종 데이터(CircleSdkInitData)를 조립합니다...");
                                CircleSdkInitData finalData = CircleSdkInitData.builder()
                                        .appId(this.cachedAppId)
                                        .userToken(userToken)
                                        .encryptionKey(encryptionKey)
                                        .challengeId(initResponse.getData().getChallengeId())
                                        .build();
                                log.info("✅ [FINISH] 최종 데이터 조립 완료!");
                                return finalData;
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
}
