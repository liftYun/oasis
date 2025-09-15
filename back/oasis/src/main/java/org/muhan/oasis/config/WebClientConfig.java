package org.muhan.oasis.config;

import io.netty.channel.ChannelOption;
import io.netty.handler.timeout.ReadTimeoutHandler;
import io.netty.handler.timeout.WriteTimeoutHandler;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import org.springframework.web.reactive.function.client.ExchangeStrategies;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.netty.http.client.HttpClient;

import java.time.Duration;
import java.util.concurrent.TimeUnit;

@Configuration
public class WebClientConfig {

    @Bean(name = "papagoWebClient")
    public WebClient papagoWebClient(
            @Value("${papago.base-url}") String baseUrl,
            @Value("${app.translate.timeout-ms:3000}") long timeoutMs // 기본값 3000ms
    ) {

        HttpClient httpClient = HttpClient.create()
                .option(ChannelOption.CONNECT_TIMEOUT_MILLIS, (int) timeoutMs)          // 연결 타임아웃
                .responseTimeout(Duration.ofMillis(timeoutMs))                           // 응답(전체) 타임아웃
                .doOnConnected(conn -> conn
                        .addHandlerLast(new ReadTimeoutHandler(timeoutMs, TimeUnit.MILLISECONDS))  // 읽기
                        .addHandlerLast(new WriteTimeoutHandler(timeoutMs, TimeUnit.MILLISECONDS)) // 쓰기
                );

        return WebClient.builder()
                .baseUrl(baseUrl)
                .clientConnector(new ReactorClientHttpConnector(httpClient))
                .exchangeStrategies(ExchangeStrategies.builder()
                        .codecs(c -> c.defaultCodecs().maxInMemorySize(512 * 1024))
                        .build())
                .build();
    }

    @Bean(name = "circleWebClient")
    public WebClient circleWebClient(
            @Value("${circle.base-url}") String baseUrl,
            @Value("${circle.api-key}") String apiKey,
            @Value("${app.circle.timeout-ms:5000}") long timeoutMs
    ) {
        HttpClient httpClient = HttpClient.create()
                .option(ChannelOption.CONNECT_TIMEOUT_MILLIS, (int) timeoutMs)
                .responseTimeout(Duration.ofMillis(timeoutMs))
                .doOnConnected(conn -> conn
                        .addHandlerLast(new ReadTimeoutHandler(timeoutMs, TimeUnit.MILLISECONDS))
                        .addHandlerLast(new WriteTimeoutHandler(timeoutMs, TimeUnit.MILLISECONDS))
                );

        return WebClient.builder()
                .baseUrl(baseUrl)
                .defaultHeader("Authorization", "Bearer " + apiKey) // Circle API 공통 헤더
                .clientConnector(new ReactorClientHttpConnector(httpClient))
                .exchangeStrategies(ExchangeStrategies.builder()
                        .codecs(c -> c.defaultCodecs().maxInMemorySize(512 * 1024))
                        .build())
                .build();
    }
}
