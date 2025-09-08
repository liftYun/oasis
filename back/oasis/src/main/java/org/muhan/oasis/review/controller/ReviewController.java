package org.muhan.oasis.review.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import jakarta.validation.Valid;
import lombok.extern.log4j.Log4j2;
import org.muhan.oasis.common.base.BaseResponse;
import org.muhan.oasis.review.service.ReviewService;
import org.muhan.oasis.review.vo.in.RegistReviewRequestVo;
import org.muhan.oasis.security.dto.out.CustomUserDetails;
import org.muhan.oasis.security.vo.in.RegistRequestVo;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

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
    public BaseResponse<?> registReview(
            @AuthenticationPrincipal CustomUserDetails customUserDetails,
            @Parameter(description = "예약 아이디")
            @Valid @RequestBody RegistReviewRequestVo registReviewRequestVo
            ){
        Long userId = customUserDetails.getUserId();
        return reviewService.registReview(userId, registReviewRequestVo.toDto())
                ? BaseResponse.ok()
                : BaseResponse.error(FAIL_REGIST_REVIEW);
    }

}
