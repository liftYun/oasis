package org.muhan.oasis.booking;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

@Component
@RequiredArgsConstructor
public class CircleClient {

    private final WebClient.Builder webClientBuilder;

    @Value("${circle.base-url}")
    private String baseUrl;

    @Value("${circle.api-key}")
    private String apiKey; // App-level API Key

    public WebClient appClient() {
        // 앱키로 호출하는 클라이언트 (init-session 등)
        return webClientBuilder
                .baseUrl(baseUrl)
                .defaultHeader(HttpHeaders.AUTHORIZATION, "Bearer " + apiKey)
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .build();
    }

    public WebClient userClient(String userToken) {
        // 유저토큰으로 호출하는 클라이언트 (contractExecution 등)
        return webClientBuilder
                .baseUrl(baseUrl)
                .defaultHeader("X-User-Token", userToken)
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .build();
    }
}
