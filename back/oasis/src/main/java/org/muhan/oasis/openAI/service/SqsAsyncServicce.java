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
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import com.fasterxml.jackson.databind.ObjectMapper;



@Service
@RequiredArgsConstructor
public class SqsAsyncServicce {

    private final OpenAiClient openAiClient;
    private final ObjectMapper objectMapper;
    private final ReviewService reviewService;
    private final SseService sseService;

    private final ExecutorService executor = Executors.newFixedThreadPool(10);


    @SqsListener("${cloud.aws.sqs.queue.stay-translation-url}")
    public void listenStayTransQueue(String messageBody){
        try {
            MessageDto messageDto = objectMapper.readValue(messageBody, MessageDto.class);
            StayRequestDto request = objectMapper.convertValue(messageDto.data(), StayRequestDto.class);

            CompletableFuture.supplyAsync(() -> {
                        try {
                            return openAiClient.translateStay(request);
                        } catch (JsonProcessingException e) {
                            System.err.println("Translation failed due to JSON processing error: " + e.getMessage());
                            throw new RuntimeException(e);
                        }
                    }, executor)
                    .thenAcceptAsync(translationResult -> {
                        sseService.sendToClient(messageDto.id(),"stayTranslate", translationResult);
                    }, executor)
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
                    }, executor)
                    .thenAcceptAsync(translationResult -> {

                        reviewService.updateReview(Long.getLong(messageDto.id()), translationResult);

                    }, executor)
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
                            System.err.println("Translation failed due to JSON processing error: " + e.getMessage());
                            throw new RuntimeException(e);
                        }
                    }, executor) // 별도 스레드 풀에서 번역 실행
                    .thenAcceptAsync(translationResult -> { // 번역 완료 후 다음 작업 실행


                    }, executor)
                    .exceptionally(throwable -> {
                        throw new BaseException(BaseResponseStatus.FAIL_OPENAI_COMMUNICATION);
                    });

        } catch (Exception e) {
            System.err.println("Error processing message from SQS: " + e.getMessage());
        }
    }

}