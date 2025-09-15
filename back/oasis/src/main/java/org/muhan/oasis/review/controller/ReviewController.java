package org.muhan.oasis.review.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.Parameters;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.validation.Valid;
import lombok.extern.log4j.Log4j2;
import org.muhan.oasis.common.base.BaseResponse;
import org.muhan.oasis.review.dto.in.RegistReviewRequestDto;
import org.muhan.oasis.review.service.ReviewService;
import org.muhan.oasis.review.vo.in.RegistReviewRequestVo;
import org.muhan.oasis.review.vo.out.ReviewDetailResponseVo;
import org.muhan.oasis.review.vo.out.ReviewResponseVo;
import org.muhan.oasis.review.vo.out.StayReviewResponseVo;
import org.muhan.oasis.security.dto.out.CustomUserDetails;
import org.muhan.oasis.user.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

import static org.muhan.oasis.common.base.BaseResponseStatus.CREATED;

@RestController
@ResponseBody
@Log4j2
@RequestMapping("/api/v1/review")
public class ReviewController {
    private final ReviewService reviewService;
    private final UserService userService;

    public ReviewController(ReviewService reviewService, UserService userService) {
        this.reviewService = reviewService;
        this.userService = userService;
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
            @Valid @RequestBody RegistReviewRequestVo registReviewRequestVo
    ) {
        Long userId = userService.getUserIdByUserUuid(customUserDetails.getUserUuid());
        Long reviewId = reviewService.registReview(userId, registReviewRequestVo.toDto());

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

    @Operation(
            summary = "내 리뷰 목록 조회",
            description = """
        로그인한 사용자의 ID를 기반으로 해당 사용자가 작성한 모든 리뷰 목록을 조회합니다.
        - 리뷰 번역이 완료되기 전이면 원문으로 대체합니다.
        """,
            tags = {"리뷰"}
    )
    @GetMapping("/list")
    public BaseResponse<List<ReviewResponseVo>> list(
            @AuthenticationPrincipal CustomUserDetails customUserDetails)
    {
        Long userId = userService.getUserIdByUserUuid(customUserDetails.getUserUuid());
        List<ReviewResponseVo> result = reviewService.getListOfReviews(userId);
        return BaseResponse.of(result);
    }


    @Operation(
            summary = "리뷰 상세 정보 조회",
            description = """
        특정 리뷰의 상세 정보(리뷰 텍스트 포함)를 조회합니다.
        로그인한 사용자 본인이 작성한 리뷰만 조회 가능합니다.
        """,
            tags = {"리뷰"}
    )
    @Parameters({
            @Parameter(name = "reviewId", description = "조회할 리뷰의 ID", required = true, example = "1"),
    })
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "리뷰 상세 정보 조회 성공"),
            @ApiResponse(responseCode = "403", description = "접근 권한 없음"),
            @ApiResponse(responseCode = "404", description = "리뷰를 찾을 수 없음")
    })
    @GetMapping("/detail/{reviewId}")
    public BaseResponse<ReviewDetailResponseVo> reviewDetail(
            @PathVariable Long reviewId,
            @AuthenticationPrincipal CustomUserDetails customUserDetails)
    {
        Long userId = userService.getUserIdByUserUuid(customUserDetails.getUserUuid());
        ReviewDetailResponseVo result = reviewService.getReviewDetail(userId, reviewId);
        return BaseResponse.of(result);
    }


    @Operation(
            summary = "숙소별 리뷰 목록 조회",
            description = """
        특정 숙소에 대한 모든 리뷰 목록을 조회합니다.
        - 사용자 언어에 맞는 리뷰 내용으로 조회합니다.
        """,
            tags = {"리뷰"}
    )
    @Parameters({
            @Parameter(name = "stayId", description = "리뷰를 조회할 숙소의 ID", required = true, example = "10"),
    })
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "숙소 리뷰 목록 조회 성공"),
            @ApiResponse(responseCode = "404", description = "사용자를 찾을 수 없음")
    })
    @GetMapping("/{stayId}")
    public BaseResponse<List<StayReviewResponseVo>> stayReviews(
            @PathVariable Long stayId,
            @AuthenticationPrincipal CustomUserDetails customUserDetails)
    {
        Long userId = userService.getUserIdByUserUuid(customUserDetails.getUserUuid());
        List<StayReviewResponseVo> result = reviewService.getStayReview(userId, stayId);
        return BaseResponse.of(result);
    }

}
