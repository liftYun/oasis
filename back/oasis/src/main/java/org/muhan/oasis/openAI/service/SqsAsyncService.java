package org.muhan.oasis.openAI.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.nimbusds.jose.shaded.gson.Gson;
import io.awspring.cloud.sqs.annotation.SqsListener;
import io.awspring.cloud.sqs.listener.SqsHeaders;
import io.awspring.cloud.sqs.listener.acknowledgement.Acknowledgement;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.muhan.oasis.common.base.BaseResponseStatus;
import org.muhan.oasis.common.exception.BaseException;
import org.muhan.oasis.openAI.client.OpenAiClient;
import org.muhan.oasis.openAI.dto.in.MessageEnvelope;
import org.muhan.oasis.openAI.dto.in.ReviewListRequestDto;
import org.muhan.oasis.openAI.dto.in.ReviewRequestDto;
import org.muhan.oasis.openAI.dto.in.StayRequestDto;
import org.muhan.oasis.openAI.dto.out.MatterMostMessageDto;
import org.muhan.oasis.review.service.ReviewService;
import org.muhan.oasis.stay.service.StayService;
import org.muhan.oasis.valueobject.Rate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.reactive.function.client.WebClient;
import software.amazon.awssdk.services.sqs.model.Message;

import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.Executor;
@Service
@Slf4j
@RequiredArgsConstructor
public class SqsAsyncService {

    private final ObjectMapper om;
    private final WebClient web = WebClient.create();

    @Value("${monitor.mm.webhook}")
    private String mmWebhook;

    private final OpenAiClient openAiClient;
    private final ObjectMapper objectMapper;
    private final ReviewService reviewService;
    private final SseService sseService;
    private final Executor threadPoolTaskExecutor;
    private final StayService stayService;

    @Value("${cloud.aws.sqs.queue.stay-translation-dlq}")
    private String stayTransDLQ;
    @Value("${cloud.aws.sqs.queue.review-translation-dlq}")
    private String reviewTransDLQ;
    @Value("${cloud.aws.sqs.queue.review-summary-dlq}")
    private String reviewSummaryDLQ;

    @SqsListener(
            value ="${cloud.aws.sqs.queue.stay-translation}",
            factory = "manualAckSqsListenerContainerFactory")
    public void listenStayTransQueue(MessageEnvelope<StayRequestDto> env,
                                     Acknowledgement ack)
    {
        CompletableFuture
                .supplyAsync(() -> {
                    try {
                        StayRequestDto requestDto = objectMapper.convertValue(env.payload(), StayRequestDto.class);
                        return openAiClient.translateStay(requestDto);
                    } catch (JsonProcessingException e) {
                        throw new BaseException(BaseResponseStatus.SERIALIZATION_FAIL);
                    }
                }, threadPoolTaskExecutor)
                .thenAccept(result -> {
                    String nickname = env.meta().get("nickname");
                    result.setUuid(env.id());
                    sseService.sendToClient(nickname, "stayTranslate", result);
                    ack.acknowledge();
                })
                .exceptionally(ex -> {
                    System.out.println(ex.getMessage());
                    return null;
                });
    }


    @SqsListener(
            value ="${cloud.aws.sqs.queue.review-translation}",
            factory = "manualAckSqsListenerContainerFactory")
    public void listenReviewTransQueue(MessageEnvelope<ReviewRequestDto> env,
                                       Acknowledgement ack)
    {
        CompletableFuture
                .supplyAsync(() -> {
                    try {
                        ReviewRequestDto requestDto = objectMapper.convertValue(env.payload(), ReviewRequestDto.class);
                        return openAiClient.translateReview(requestDto);
                    } catch (JsonProcessingException e) {
                        throw new BaseException(BaseResponseStatus.SERIALIZATION_FAIL);
                    }
                }, threadPoolTaskExecutor)
                .thenAccept(result -> {
                    Long reviewId = Long.parseLong(env.meta().get("review"));
                    reviewService.updateReview(reviewId, result);
                    ack.acknowledge();
                })
                .exceptionally(ex -> {
                    return null;
                });
    }

    @SqsListener(
            value ="${cloud.aws.sqs.queue.review-summary}",
            factory = "manualAckSqsListenerContainerFactory")
    public void listenReviewSummaryQueue(MessageEnvelope<ReviewListRequestDto> env,
                                       Acknowledgement ack)
    {
        CompletableFuture
                .supplyAsync(() -> {
                    try {
                        ReviewListRequestDto requestDto = objectMapper.convertValue(env.payload(), ReviewListRequestDto.class);
                        return openAiClient.summarizeReviews(requestDto);
                    } catch (JsonProcessingException e) {
                        throw new BaseException(BaseResponseStatus.SERIALIZATION_FAIL);
                    }
                }, threadPoolTaskExecutor)
                .thenAccept(result -> {
                    Long stayId = Long.parseLong(env.meta().get("stay"));
                    Rate rate = Rate.HIGH_RATE.getDescription().equals(env.meta().get("rate")) ? Rate.HIGH_RATE : Rate.LOW_RATE ;
                    stayService.updateReviewSummary(stayId, rate, result);
                    ack.acknowledge();
                })
                .exceptionally(ex -> {
                    return null;
                });
    }

    @SqsListener(
            value = "${cloud.aws.sqs.queue.review-summary-dlq}",
            factory = "manualAckSqsListenerContainerFactory"
    )
    public void onReviewSummaryDlq(MessageEnvelope<ReviewListRequestDto> env,
                                   @Header(SqsHeaders.SQS_SOURCE_DATA_HEADER) Message raw,
                                   Acknowledgement ack) {
        try {
            log.error("[DLQ][review-summary] id={}, meta={}", env.id(), env.meta());

            String payload = prettyTrim(om.writeValueAsString(env.payload()), 1000);
            var dto = new MatterMostMessageDto(
                    reviewSummaryDLQ, raw.messageId(), raw.attributesAsStrings().getOrDefault("ApproximateReceiveCount", "1"),
                    env.id(), String.valueOf(env.type()), env.version(),
                    env.correlationId(), env.meta(),
                    payload
            );

            web.post()
                    .uri(mmWebhook)
                    .bodyValue(Map.of("text", dto.toMattermostText()))
                    .retrieve()
                    .toBodilessEntity()
                    .block();

            ack.acknowledge();
        } catch (Exception e) {
            log.error("[DLQ][review-summary] re-drive failed id={}, ex={}", env.id(), e.toString());
        }
    }

    @SqsListener(
            value = "${cloud.aws.sqs.queue.stay-translation-dlq}",
            factory = "manualAckSqsListenerContainerFactory"
    )
    public void onStayTransDlq(MessageEnvelope<StayRequestDto> env,
                                   @Header(SqsHeaders.SQS_SOURCE_DATA_HEADER) Message raw,
                                   Acknowledgement ack) {
        try {
            log.error("[DLQ][stay-translation] id={}, meta={}", env.id(), env.meta());

            String payload = prettyTrim(om.writeValueAsString(env.payload()), 1000);
            var dto = new MatterMostMessageDto(
                    stayTransDLQ, raw.messageId(), raw.attributesAsStrings().getOrDefault("ApproximateReceiveCount", "1"),
                    env.id(), String.valueOf(env.type()), env.version(),
                    env.correlationId(), env.meta(),
                    payload
            );

            web.post()
                    .uri(mmWebhook)
                    .bodyValue(Map.of("text", dto.toMattermostText()))
                    .retrieve()
                    .toBodilessEntity()
                    .block();

            ack.acknowledge();
        } catch (Exception e) {
            log.error("[DLQ][stay-translation] re-drive failed id={}, ex={}", env.id(), e.toString());
        }
    }

    @SqsListener(
            value = "${cloud.aws.sqs.queue.review-translation-dlq}",
            factory = "manualAckSqsListenerContainerFactory"
    )
    public void onReviewTransDlq(MessageEnvelope<ReviewRequestDto> env,
                                 @Header(SqsHeaders.SQS_SOURCE_DATA_HEADER) Message raw,
                               Acknowledgement ack) {
        try {
            log.error("[DLQ][review-translation] id={}, meta={}", env.id(), env.meta());

            String payload = prettyTrim(om.writeValueAsString(env.payload()), 1000);
            var dto = new MatterMostMessageDto(
                    reviewTransDLQ, raw.messageId(), raw.attributesAsStrings().getOrDefault("ApproximateReceiveCount", "1"),
                    env.id(), String.valueOf(env.type()), env.version(),
                    env.correlationId(), env.meta(),
                    payload
            );

            web.post()
                    .uri(mmWebhook)
                    .bodyValue(Map.of("text", dto.toMattermostText()))
                    .retrieve()
                    .toBodilessEntity()
                    .block();

            ack.acknowledge();
        } catch (Exception e) {
            log.error("[DLQ][review-translation] re-drive failed id={}, ex={}", env.id(), e.toString());
        }
    }

    private static String prettyTrim(String json, int max) {
        if (json == null) return "null";
        return json.length() > max ? json.substring(0, max) + " …" : json;
    }
}
