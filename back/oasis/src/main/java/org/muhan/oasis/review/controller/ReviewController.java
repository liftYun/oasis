package org.muhan.oasis.review.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import jakarta.validation.Valid;
import lombok.extern.log4j.Log4j2;
import org.muhan.oasis.common.base.BaseResponse;
import org.muhan.oasis.review.dto.in.RegistReviewRequestDto;
import org.muhan.oasis.review.service.ReviewService;
import org.muhan.oasis.review.vo.in.RegistReviewRequestVo;
import org.muhan.oasis.review.vo.out.ReviewResponseVo;
import org.muhan.oasis.security.dto.out.CustomUserDetails;
import org.muhan.oasis.security.vo.in.RegistRequestVo;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

import static org.muhan.oasis.common.base.BaseResponseStatus.CREATED;
import static org.muhan.oasis.common.base.BaseResponseStatus.FAIL_REGIST_REVIEW;

@RestController
@ResponseBody
@Log4j2
@RequestMapping("/api/v1/review")
public class ReviewController {
    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @Operation(
            summary = "리뷰 작성",
            description = """
                예약 ID 기반으로 이용완료 된 숙소 리뷰 작성
                - 이용 완료 시에만 리뷰 작성 버튼 노출 
                """,
            tags = {"리뷰"}
    )
    @PostMapping("/regist")
    public ResponseEntity<BaseResponse<Void>> registReview(
            @AuthenticationPrincipal CustomUserDetails customUserDetails,
            @Valid @RequestBody RegistReviewRequestDto registReviewRequestDto
    ) {
        Long userId = customUserDetails.getUserId();
        Long reviewId = reviewService.registReview(userId, registReviewRequestDto);

        URI location = URI.create("/api/v1/review/" + reviewId);

        BaseResponse<Void> body = new BaseResponse<>(
                CREATED.getHttpStatusCode(),  // httpStatus
                CREATED.isSuccess(),          // isSuccess
                CREATED.getMessage(),         // message
                CREATED.getCode(),            // code
                null                          // result (생성은 바디 없음)
        );

        return ResponseEntity.status(HttpStatus.CREATED)
                .location(location)
                .body(body);
    }

    @GetMapping("/list")
    public BaseResponse<List<ReviewResponseVo>> list(
            @AuthenticationPrincipal CustomUserDetails customUserDetails)
    {
        List<ReviewResponseVo> result = reviewService.getListOfReviews(customUserDetails.getUserId());
        return BaseResponse.of(result);
    }

    // TODO : 리뷰 상세 조회

    // TODO : 숙소 별 리뷰 리스트 조회
}
