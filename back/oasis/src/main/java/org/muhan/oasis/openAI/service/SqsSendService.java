package org.muhan.oasis.openAI.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.awspring.cloud.sqs.operations.SqsTemplate;
import lombok.RequiredArgsConstructor;
import org.muhan.oasis.common.base.BaseResponseStatus;
import org.muhan.oasis.common.exception.BaseException;
import org.muhan.oasis.openAI.dto.in.ReviewRequestDto;
import org.muhan.oasis.openAI.dto.in.StayRequestDto;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.services.sqs.SqsAsyncClient;
import software.amazon.awssdk.services.sqs.model.SendMessageRequest;


@Service
@RequiredArgsConstructor
public class SqsSendService {
    private final ObjectMapper objectMapper;
    private final SqsAsyncClient sqsAsyncClient;

    @Value("${cloud.aws.sqs.queue.stay-translation-url}")
    private String stayTransQueue;
    @Value("${cloud.aws.sqs.queue.review-translation-url}")
    private String reviewTransQueue;
    @Value("${cloud.aws.sqs.queue.review-summary-url}")
    private String reviewSummaryQueue;


    public void sendStayTransMessage(StayRequestDto stayRequest) {
        try {

            String messageBody = objectMapper.writeValueAsString(stayRequest);

            SendMessageRequest sendMsgRequest = SendMessageRequest.builder()
                    .queueUrl(stayTransQueue)
                    .messageBody(messageBody)
                    .build();

            sqsAsyncClient.sendMessage(sendMsgRequest)
                    .thenRun(() -> System.out.println("Message sent asynchronously."));

        } catch (JsonProcessingException e) {
            throw new BaseException(BaseResponseStatus.SERIALIZATION_FAIL);
        }
    }

    public void sendReviewTransMessage(ReviewRequestDto reviewRequestDto) {
        try {

            String messageBody = objectMapper.writeValueAsString(reviewRequestDto);

            SendMessageRequest sendMsgRequest = SendMessageRequest.builder()
                    .queueUrl(reviewTransQueue)
                    .messageBody(messageBody)
                    .build();

            sqsAsyncClient.sendMessage(sendMsgRequest)
                    .thenRun(() -> System.out.println("Message sent asynchronously."));

        } catch (JsonProcessingException e) {
            throw new BaseException(BaseResponseStatus.SERIALIZATION_FAIL);
        }
    }

    // 리뷰요약??
}
