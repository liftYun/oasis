package org.muhan.oasis.openAI.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import io.awspring.cloud.sqs.annotation.SqsListener;
import lombok.RequiredArgsConstructor;
import org.muhan.oasis.common.base.BaseResponseStatus;
import org.muhan.oasis.common.exception.BaseException;
import org.muhan.oasis.openAI.client.OpenAiClient;
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

    private final ExecutorService executor = Executors.newFixedThreadPool(10);


    @SqsListener("${cloud.aws.sqs.queue.stay-translation-url}")
    public void listenStayTransQueue(String messageBody){
        try {
            StayRequestDto request = objectMapper.readValue(messageBody, StayRequestDto.class);

            CompletableFuture.supplyAsync(() -> {
                        try {
                            return openAiClient.translateStay(request);
                        } catch (JsonProcessingException e) {
                            System.err.println("Translation failed due to JSON processing error: " + e.getMessage());
                            throw new RuntimeException(e);
                        }
                    }, executor) // 별도 스레드 풀에서 번역 실행
                    .thenAcceptAsync(translationResult -> { // 번역 완료 후 다음 작업 실행
                        System.out.println("숙소번역완료 : " + translationResult.getTitle());
                        System.out.println("숙소번역완료 : " + translationResult.getContent());
                        System.out.println("숙소번역완료 : " + translationResult.getDetailAddress());


                        // 웹소켓으로 번역 완료 알림 전송
                        // ...
                    }, executor)
                    .exceptionally(throwable -> {
                        System.err.println("An error occurred during translation: " + throwable.getMessage());
                        // 번역 실패 시 재시도 로직이나 데드 레터 큐로 이동
                        return null;
                    });

        } catch (JsonProcessingException e) {
            throw new BaseException(BaseResponseStatus.SERIALIZATION_FAIL);
        }
    }


    @SqsListener("${cloud.aws.sqs.queue.review-translation-url}")
    public void listenReviewTransQueue(String messageBody){
        try {
            ReviewRequestDto request = objectMapper.readValue(messageBody, ReviewRequestDto.class);

            CompletableFuture.supplyAsync(() -> {
                        try {
                            return openAiClient.translateReview(request);
                        } catch (JsonProcessingException e) {
                            throw new BaseException(BaseResponseStatus.SERIALIZATION_FAIL);
                        }
                    }, executor) // 별도 스레드 풀에서 번역 실행
                    .thenAcceptAsync(translationResult -> { // 번역 완료 후 다음 작업 실행
                        // db에 리뷰 업데이트
                        reviewService.updateReview(request.getReviewId(), translationResult);

                    }, executor)
                    .exceptionally(throwable -> {
                        System.err.println("An error occurred during translation: " + throwable.getMessage());
                        // 번역 실패 시 재시도 로직이나 데드 레터 큐로 이동
                        return null;
                    });

        } catch (JsonProcessingException e) {
            throw new BaseException(BaseResponseStatus.SERIALIZATION_FAIL);
        }
    }

    @SqsListener("${cloud.aws.sqs.queue.review-summary-url}")
    public void listenReviewSummaryQueue(String messageBody){
        try {
            ReviewRequestDto request = objectMapper.readValue(messageBody, ReviewRequestDto.class);
            System.out.println("리뷰요약시작");

            CompletableFuture.supplyAsync(() -> {
                        try {
                            return openAiClient.translateReview(request);
                        } catch (JsonProcessingException e) {
                            System.err.println("Translation failed due to JSON processing error: " + e.getMessage());
                            throw new RuntimeException(e);
                        }
                    }, executor) // 별도 스레드 풀에서 번역 실행
                    .thenAcceptAsync(translationResult -> { // 번역 완료 후 다음 작업 실행
                        System.out.println("리뷰번역완료 : " + translationResult.getContent());

                        // db에 리뷰 업로드하기



                    }, executor)
                    .exceptionally(throwable -> {
                        System.err.println("An error occurred during translation: " + throwable.getMessage());
                        // 번역 실패 시 재시도 로직이나 데드 레터 큐로 이동
                        return null;
                    });

        } catch (Exception e) {
            System.err.println("Error processing message from SQS: " + e.getMessage());
        }
    }

}