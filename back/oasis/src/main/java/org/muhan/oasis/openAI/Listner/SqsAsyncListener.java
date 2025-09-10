package org.muhan.oasis.openAI.Listner;

import com.fasterxml.jackson.core.JsonProcessingException;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.muhan.oasis.openAI.client.OpenAiClient;
import org.muhan.oasis.openAI.dto.in.StayRequestDto;
import org.muhan.oasis.openAI.dto.out.StayTranslationResultDto;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import software.amazon.awssdk.services.sqs.SqsAsyncClient;
import software.amazon.awssdk.services.sqs.model.ReceiveMessageRequest;
import software.amazon.awssdk.services.sqs.model.Message;
import software.amazon.awssdk.services.sqs.model.DeleteMessageRequest;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import com.fasterxml.jackson.databind.ObjectMapper;


@Component
@RequiredArgsConstructor
public class SqsAsyncListener {

    private final OpenAiClient openAiClient;
    private final SqsAsyncClient sqsAsyncClient;
    private final ObjectMapper objectMapper;
    @Value("${cloud.aws.sqs.queue.url}")
    private String sqsQueueUrl;
    private final ExecutorService executor = Executors.newFixedThreadPool(10);

    @PostConstruct
    public void startListening() {
        pollQueue();
    }

    private void pollQueue() {
        ReceiveMessageRequest receiveRequest = ReceiveMessageRequest.builder()
                .queueUrl(sqsQueueUrl)
                .maxNumberOfMessages(10)
                .waitTimeSeconds(20) // 롱 폴링을 사용해 효율성 향상
                .build();

        sqsAsyncClient.receiveMessage(receiveRequest)
                .thenAcceptAsync(response -> {
                    for (Message message : response.messages()) {
                        // 메시지별로 비동기 처리
                        processMessage(message);
                    }
                    pollQueue();
                }, executor)
                .exceptionally(throwable -> {
                    System.err.println("Error while polling SQS: " + throwable.getMessage());
                    pollQueue();
                    return null;
                });
    }

    private void processMessage(Message message) {
        // 어떤 메세지인지 구분이 필요
        // 타입이랑 데이터로 구분 필요

        /*
        {
          "type": "message_type",
          "data": {
            "key1": "value1",
            "key2": "value2"
          }
        }
        */

        try {
            StayRequestDto request = objectMapper.readValue(message.body(), StayRequestDto.class);
            System.out.println("번역시작");

            CompletableFuture.supplyAsync(() -> {
                        try {
                            return openAiClient.translateStay(request);
                        } catch (JsonProcessingException e) {
                            System.err.println("Translation failed due to JSON processing error: " + e.getMessage());
                            throw new RuntimeException(e);
                        }
                    }, executor) // 별도 스레드 풀에서 번역 실행
                    .thenAcceptAsync(translationResult -> { // 번역 완료 후 다음 작업 실행
                        System.out.println("번역완료 : " + translationResult.getTitle());
                        System.out.println("번역완료 : " + translationResult.getContent());

                        deleteMessage(sqsQueueUrl, message.receiptHandle());

                        // 웹소켓으로 번역 완료 알림 전송
                        // ...
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

    private void deleteMessage(String queueUrl, String receiptHandle) {
        sqsAsyncClient.deleteMessage(DeleteMessageRequest.builder()
                .queueUrl(queueUrl)
                .receiptHandle(receiptHandle)
                .build());
    }
}