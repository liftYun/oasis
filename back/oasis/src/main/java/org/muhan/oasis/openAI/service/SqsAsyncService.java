package org.muhan.oasis.openAI.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.nimbusds.jose.shaded.gson.Gson;
import io.awspring.cloud.sqs.annotation.SqsListener;
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
import org.muhan.oasis.review.service.ReviewService;
import org.muhan.oasis.stay.service.StayService;
import org.muhan.oasis.valueobject.Rate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.client.RestTemplate;

import java.util.concurrent.CompletableFuture;
import java.util.concurrent.Executor;
@Service
@Slf4j
@RequiredArgsConstructor
public class SqsAsyncService {

    private Logger log =  LoggerFactory.getLogger(MatterMostSender.class);
    private String webhookUrl= "{MatterMostWebHookUrl}";

    private final OpenAiClient openAiClient;
    private final ObjectMapper objectMapper;
    private final ReviewService reviewService;
    private final SseService sseService;
    private final Executor threadPoolTaskExecutor;
    private final StayService stayService;

    public void sendMessage(Exception excpetion, String uri, String params) {
        try {
            /*
            MatterMostMessageDTO.Attachment attachment = MatterMostMessageDTO.Attachment.builder()
                    .channel(mmProperties.getChannel())
                    .authorIcon(mmProperties.getAuthorIcon())
                    .authorName(mmProperties.getAuthorName())
                    .color(mmProperties.getColor())
                    .pretext(mmProperties.getPretext())
                    .title(mmProperties.getTitle())
                    .text(mmProperties.getText())
                    .footer(mmProperties.getFooter())
                    .build();

            attachment.addExceptionInfo(excpetion, uri, params);
            MatterMostMessageDTO.Attachments attachments = new MatterMostMessageDTO.Attachments(attachment);
            attachments.addProps(excpetion);
            String payload = new Gson().toJson(attachments);
            */

            HttpHeaders headers = new HttpHeaders();
            headers.set("Content-type", MediaType.APPLICATION_JSON_VALUE);

            HttpEntity<String> entity = new HttpEntity<>(payload, headers);
            RestTemplate restTemplate = new RestTemplate();
            restTemplate.postForEntity(webhookUrl, entity, String.class);

        } catch (Exception e) {
            log.error("#### ERROR!! Notification Manager : {}", e.getMessage());
        }

    }

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
                                   Acknowledgement ack) {
        try {
            // 1) 실패 사건 로깅/모니터링/알림 (필요 시 DB 적재)
            log.error("[DLQ][review-summary] id={}, meta={}", env.id(), env.meta());
            // TODO: Slack/CloudWatch 알림, 실패 테이블 저장 등


            // 3) 성공적으로 처리/재주입했으면 ACK (DLQ에서 삭제)
            ack.acknowledge();
        } catch (Exception e) {
            // 실패 시 ACK 하지 않음 → DLQ 가시성 타임아웃 후 다시 시도
            log.error("[DLQ][review-summary] re-drive failed id={}, ex={}", env.id(), e.toString());
        }
    }

    @SqsListener(
            value = "${cloud.aws.sqs.queue.stay-translation-dlq}",
            factory = "manualAckSqsListenerContainerFactory"
    )
    public void onStayTransDlq(MessageEnvelope<ReviewListRequestDto> env,
                                   Acknowledgement ack) {
        try {
            // 1) 실패 사건 로깅/모니터링/알림 (필요 시 DB 적재)
            log.error("[DLQ][stay-translation] id={}, meta={}", env.id(), env.meta());
            // TODO: Slack/CloudWatch 알림, 실패 테이블 저장 등


            // 3) 성공적으로 처리/재주입했으면 ACK (DLQ에서 삭제)
            ack.acknowledge();
        } catch (Exception e) {
            // 실패 시 ACK 하지 않음 → DLQ 가시성 타임아웃 후 다시 시도
            log.error("[DLQ][stay-translation] re-drive failed id={}, ex={}", env.id(), e.toString());
        }
    }

    @SqsListener(
            value = "${cloud.aws.sqs.queue.review-translation-dlq}",
            factory = "manualAckSqsListenerContainerFactory"
    )
    public void onReviewTransDlq(MessageEnvelope<ReviewListRequestDto> env,
                               Acknowledgement ack) {
        try {
            // 1) 실패 사건 로깅/모니터링/알림 (필요 시 DB 적재)
            log.error("[DLQ][review-translation] id={}, meta={}", env.id(), env.meta());
            // TODO: Slack/CloudWatch 알림, 실패 테이블 저장 등


            // 3) 성공적으로 처리/재주입했으면 ACK (DLQ에서 삭제)
            ack.acknowledge();
        } catch (Exception e) {
            // 실패 시 ACK 하지 않음 → DLQ 가시성 타임아웃 후 다시 시도
            log.error("[DLQ][review-translation] re-drive failed id={}, ex={}", env.id(), e.toString());
        }
    }


}
