package org.muhan.oasis.openAI.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.awspring.cloud.sqs.annotation.SqsListener;
import io.awspring.cloud.sqs.listener.acknowledgement.Acknowledgement;
import lombok.RequiredArgsConstructor;
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
import org.springframework.stereotype.Service;

import java.util.concurrent.CompletableFuture;
import java.util.concurrent.Executor;
@Service
@RequiredArgsConstructor
public class SqsAsyncService {

    private final OpenAiClient openAiClient;
    private final ObjectMapper objectMapper;
    private final ReviewService reviewService;
    private final SseService sseService;
    private final Executor threadPoolTaskExecutor;
    private final StayService stayService;

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
                    result.setUUid(env.id());
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

}
