package org.muhan.oasis.openAI.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import io.awspring.cloud.sqs.annotation.SqsListener;
import lombok.RequiredArgsConstructor;
import org.muhan.oasis.common.base.BaseResponseStatus;
import org.muhan.oasis.common.exception.BaseException;
import org.muhan.oasis.openAI.client.OpenAiClient;
import org.muhan.oasis.openAI.dto.in.MessageDto;
import org.muhan.oasis.openAI.dto.in.ReviewRequestDto;
import org.muhan.oasis.openAI.dto.in.StayRequestDto;
import org.muhan.oasis.review.service.ReviewService;
import org.springframework.stereotype.Service;

import java.util.concurrent.CompletableFuture;
import java.util.concurrent.Executor;

import com.fasterxml.jackson.databind.ObjectMapper;



@Service
@RequiredArgsConstructor
public class SqsAsyncService {

    private final OpenAiClient openAiClient;
    private final ObjectMapper objectMapper;
    private final ReviewService reviewService;
    private final SseService sseService;
    private final Executor threadPoolTaskExecutor;

    @SqsListener("${cloud.aws.sqs.queue.stay-translation-url}")
    public void listenStayTransQueue(String messageBody){
        try {
            MessageDto messageDto = objectMapper.readValue(messageBody, MessageDto.class);
            StayRequestDto request = objectMapper.convertValue(messageDto.data(), StayRequestDto.class);
            System.out.println("번역시작");
            CompletableFuture.supplyAsync(() -> {
                        try {
                            return openAiClient.translateStay(request);
                        } catch (JsonProcessingException e) {
                            System.err.println("Translation failed due to JSON processing error: " + e.getMessage());
                            throw new RuntimeException(e);
                        }
                    }, threadPoolTaskExecutor)
                    .thenAcceptAsync(translationResult -> {
                        sseService.sendToClient(messageDto.id(),"stayTranslate", translationResult);
                    }, threadPoolTaskExecutor)
                    .exceptionally(throwable -> {
                        throw new BaseException(BaseResponseStatus.FAIL_OPENAI_COMMUNICATION);
                    });

        } catch (JsonProcessingException e) {
            throw new BaseException(BaseResponseStatus.SERIALIZATION_FAIL);
        }
    }


    @SqsListener("${cloud.aws.sqs.queue.review-translation-url}")
    public void listenReviewTransQueue(String messageBody){
        try {
            MessageDto messageDto = objectMapper.readValue(messageBody, MessageDto.class);
            ReviewRequestDto request = objectMapper.convertValue(messageDto.data(), ReviewRequestDto.class);

            CompletableFuture.supplyAsync(() -> {
                        try {
                            return openAiClient.translateReview(request);
                        } catch (JsonProcessingException e) {
                            throw new BaseException(BaseResponseStatus.SERIALIZATION_FAIL);
                        }
                    }, threadPoolTaskExecutor)
                    .thenAcceptAsync(translationResult -> {

                        reviewService.updateReview(Long.parseLong(messageDto.id()), translationResult);

                    }, threadPoolTaskExecutor)
                    .exceptionally(throwable -> {
                        throw new BaseException(BaseResponseStatus.FAIL_OPENAI_COMMUNICATION);
                    });

        } catch (JsonProcessingException e) {
            throw new BaseException(BaseResponseStatus.SERIALIZATION_FAIL);
        }
    }

    // 리뷰요약 아직 어떻게 할지 못 정함
    @SqsListener("${cloud.aws.sqs.queue.review-summary-url}")
    public void listenReviewSummaryQueue(String messageBody){
        try {
            ReviewRequestDto request = objectMapper.readValue(messageBody, ReviewRequestDto.class);

            CompletableFuture.supplyAsync(() -> {
                        try {
                            return openAiClient.translateReview(request);
                        } catch (JsonProcessingException e) {
                            throw new BaseException(BaseResponseStatus.SERIALIZATION_FAIL);
                        }
                    }, threadPoolTaskExecutor) // 별도 스레드 풀에서 번역 실행
                    .thenAcceptAsync(translationResult -> { // 번역 완료 후 다음 작업 실행


                    }, threadPoolTaskExecutor)
                    .exceptionally(throwable -> {
                        throw new BaseException(BaseResponseStatus.FAIL_OPENAI_COMMUNICATION);
                    });

        } catch (Exception e) {
            throw new BaseException(BaseResponseStatus.SERIALIZATION_FAIL);
        }
    }

}