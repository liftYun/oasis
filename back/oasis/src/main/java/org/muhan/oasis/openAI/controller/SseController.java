package org.muhan.oasis.openAI.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.Parameters;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;
import org.muhan.oasis.openAI.dto.in.ReviewListRequestDto;
import org.muhan.oasis.openAI.dto.in.ReviewRequestDto;
import org.muhan.oasis.openAI.service.SqsSendService;
import org.muhan.oasis.openAI.service.SseService;
import org.muhan.oasis.review.entity.ReviewEntity;
import org.muhan.oasis.review.repository.ReviewRepository;
import org.muhan.oasis.security.dto.out.CustomUserDetails;
import org.muhan.oasis.valueobject.Rate;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;
import org.springframework.http.MediaType;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequiredArgsConstructor
public class SseController {

    private final SseService sseService;
    private final ReviewRepository reviewRepository;
    private final SqsSendService sqsSendService;


    @Operation(
            summary = "SSE 연결",
            description = """
        지정된 닉네임으로 SSE(Server-Sent Events) 연결을 생성합니다.
        클라이언트는 이 연결을 통해 서버에서 실시간으로 발생하는 알림을 수신할 수 있습니다.
        """,
            tags = {"SSE"}
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "SSE 연결 성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청")
    })
    @Parameters({
            @Parameter(name = "nickname", description = "알림을 받을 사용자 닉네임", required = true)
    })
    @GetMapping(value = "/api/v1/sse/connect/{nickname}", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter connect(@PathVariable String nickname) {
        return sseService.subscribe(nickname);
    }


    @PostMapping("/test")
    public ResponseEntity<?> test(
            @AuthenticationPrincipal CustomUserDetails writer
            ){
        List<ReviewEntity> reviews = reviewRepository.findAllByStayIdOrderByCreatedAtDescWithJoins(59L);
        List<ReviewRequestDto> lowRate = new ArrayList<>();
        List<ReviewRequestDto> highRate = new ArrayList<>();
        for (ReviewEntity r : reviews) {
            if(r.getRating().compareTo(BigDecimal.valueOf(3.0)) < 0){
                lowRate.add(ReviewRequestDto.from(r, writer.getLanguage()));
            }
            else{
                highRate.add(ReviewRequestDto.from(r, writer.getLanguage()));
            }
        }
        ReviewListRequestDto lowRateReviews = new ReviewListRequestDto(lowRate);
        ReviewListRequestDto highRateReviews = new ReviewListRequestDto(highRate);

        sqsSendService.sendReviewSummaryMessage(lowRateReviews, 59L, Rate.LOW_RATE);
        sqsSendService.sendReviewSummaryMessage(highRateReviews, 59L, Rate.HIGH_RATE);

        return ResponseEntity.ok().build();
    }
}