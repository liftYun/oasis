package org.muhan.oasis.chatTranslate.util;

import lombok.RequiredArgsConstructor;
import org.muhan.oasis.chatTranslate.dto.PapagoErrorResponse;
import org.muhan.oasis.chatTranslate.dto.PapagoResponse;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Component
//@RequiredArgsConstructor
public class PapagoClient {

//    @Qualifier("papagoWebClient")
//    private final WebClient webClient;
//
//    @Value("${papago.client-id}") private String clientId;
//    @Value("${papago.client-secret}") private String clientSecret;

    private final WebClient webClient;
    private final String clientId;
    private final String clientSecret;

    public PapagoClient(
            @Qualifier("papagoWebClient") WebClient webClient,
            @Value("${papago.client-id}") String clientId,
            @Value("${papago.client-secret}") String clientSecret
    ) {
        this.webClient = webClient;
        this.clientId = clientId;
        this.clientSecret = clientSecret;
    }
    public Mono<PapagoResponse> translate(String source, String target, String text) {
        MultiValueMap<String, String> form = new LinkedMultiValueMap<>();
        form.add("source", source);
        form.add("target", target);
        form.add("text", text);

        return webClient.post()
                .uri("/nmt/v1/translation")
                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .headers(h -> {
                    h.set("X-NCP-APIGW-API-KEY-ID", clientId);
                    h.set("X-NCP-APIGW-API-KEY", clientSecret);
                })
                .bodyValue(form)
                .retrieve()
                .onStatus(HttpStatusCode::isError, resp ->
                resp.bodyToMono(PapagoErrorResponse.class)
                        .defaultIfEmpty(new PapagoErrorResponse("HTTP_"+resp.statusCode().value(), "Papago 오류(본문 없음)"))
                        .map(err -> new IllegalArgumentException(
                                err.errorMessage() != null ? err.errorMessage() : "Papago 오류"))
                )
                .bodyToMono(PapagoResponse.class)
                .switchIfEmpty(Mono.error(new IllegalArgumentException("Papago 응답 본문 없음")));

    }

}