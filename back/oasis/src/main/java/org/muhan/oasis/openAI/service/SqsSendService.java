package org.muhan.oasis.openAI.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.awspring.cloud.sqs.listener.SqsHeaders;
import io.awspring.cloud.sqs.operations.SqsTemplate;
import lombok.RequiredArgsConstructor;
import org.muhan.oasis.openAI.dto.in.MessageEnvelope;
import org.muhan.oasis.openAI.dto.in.ReviewListRequestDto;
import org.muhan.oasis.openAI.dto.in.ReviewRequestDto;
import org.muhan.oasis.openAI.dto.in.StayRequestDto;
import org.muhan.oasis.stay.dto.out.StayTranslateIdDto;
import org.muhan.oasis.valueobject.MessageType;
import org.muhan.oasis.valueobject.Rate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.messaging.Message;
import org.springframework.messaging.support.MessageBuilder;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.services.sqs.SqsAsyncClient;

import java.time.Duration;
import java.time.Instant;
import java.time.LocalDate;
import java.util.Map;
import java.util.UUID;


@Service
@RequiredArgsConstructor
public class SqsSendService {
    private final SqsTemplate sqsTemplate;

    @Value("${cloud.aws.sqs.queue.stay-translation}")
    private String stayTransQueue;
    @Value("${cloud.aws.sqs.queue.review-translation}")
    private String reviewTransQueue;
    @Value("${cloud.aws.sqs.queue.review-summary}")
    private String reviewSummaryQueue;


    public StayTranslateIdDto sendStayTransMessage(StayRequestDto stayRequest, String userNickname) {
        String uuid = UUID.randomUUID().toString();
        var message = new MessageEnvelope<>(
                uuid,
                MessageType.STAY_TRANSLATE,
                1,
                UUID.randomUUID().toString(),
                Map.of("nickname", userNickname),
                stayRequest);

        sqsTemplate.send(opts -> opts
                .queue(stayTransQueue)
                .payload(message)
                .messageGroupId("stay-" + uuid)
                .messageDeduplicationId(message.id()));



        return new StayTranslateIdDto(uuid);
    }

    public void sendReviewTransMessage(ReviewRequestDto reviewRequestDto, Long reviewId) {
        var message = new MessageEnvelope<>(
                UUID.randomUUID().toString(),
                MessageType.REVIEW_TRANSLATE,
                1,
                UUID.randomUUID().toString(),
                Map.of("review", reviewId.toString()),
                reviewRequestDto);

        sqsTemplate.send(opts -> opts
                .queue(reviewTransQueue)
                .payload(message)
                .messageGroupId("review-" + reviewId)
                .messageDeduplicationId(message.id()));
    }

    public void sendReviewSummaryMessage(ReviewListRequestDto reviewRequestDto, Long stayId, Rate rate) {
        var message = new MessageEnvelope<>(
                stayId + ":" + rate,
                MessageType.REVIEW_SUMMARIZE,
                1,
                UUID.randomUUID().toString(),
                Map.of("stay", stayId.toString(), "rate", rate.getDescription()),
                reviewRequestDto);

        sqsTemplate.send(opts -> opts
                .queue(reviewSummaryQueue)
                .payload(message)
                .messageGroupId("review-summary-"+stayId)
                .messageDeduplicationId(message.id()));
    }
}
