package org.muhan.oasis.wish.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.muhan.oasis.common.base.BaseResponse;
import org.muhan.oasis.security.dto.out.CustomUserDetails;
import org.muhan.oasis.stay.dto.out.StayCardDto;
import org.muhan.oasis.wish.dto.in.CreateWishRequestDto;
import org.muhan.oasis.wish.dto.out.WishResponseDto;
import org.muhan.oasis.wish.service.WishService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

import static org.muhan.oasis.common.base.BaseResponseStatus.CREATED;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/wish")
public class WishController {

    private final WishService wishService;

    @Operation(
            summary = "관심 숙소 생성",
            description = "사용자의 관심 숙소를 생성합니다."
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "201",
                    description = "생성됨",
                    content = @Content(
                            mediaType = "application/json",
                            examples = @ExampleObject(
                                    name = "성공 응답",
                                    value = """
                                            {
                                                "httpStatus": "CREATED",
                                                "isSuccess": true,
                                                "message": "리소스가 생성되었습니다.",
                                                "code": 201,
                                                "result": null
                                            }
                                            """
                            )
                    )
            ),
            @ApiResponse(responseCode = "400", description = "잘못된 요청", content = @Content),
            @ApiResponse(responseCode = "401", description = "인증 필요", content = @Content),
            @ApiResponse(responseCode = "409", description = "이미 찜된 경우 등 충돌", content = @Content),
            @ApiResponse(responseCode = "500", description = "서버 오류", content = @Content)
    })
    @PostMapping("/{stayId}")
    public ResponseEntity<BaseResponse<?>> addWish(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long stayId
            ){

        wishService.addWish(userDetails.getUserUuid(), stayId);

        URI location = URI.create("/api/v1/wish");

        BaseResponse<Void> body = new BaseResponse<>(
                CREATED.getHttpStatusCode(),
                CREATED.isSuccess(),
                CREATED.getMessage(),
                CREATED.getCode(),
                null
        );

        return ResponseEntity.status(HttpStatus.CREATED)
                .location(location)
                .body(body);

    }

    @SecurityRequirement(name = "bearerAuth")
    @Operation(
            summary = "내 찜 목록 조회",
            description = "로그인한 사용자의 찜 목록을 반환합니다."
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "조회 성공",
                    content = @Content(
                            mediaType = "application/json",
                            // 실제 BaseResponse<List<WishResponseDto>> 구조에 맞춘 간단 예시
                            examples = @ExampleObject(
                                    name = "성공 응답 예시",
                                    value =
                                            """
                                                    {
                                                        "httpStatus": "OK",
                                                        "isSuccess": true,
                                                        "message": "요청에 성공하였습니다.",
                                                        "code": 200,
                                                        "result": [
                                                            {
                                                                "id": 1,
                                                                "stayCardDto": {
                                                                    "stayId": 32,
                                                                    "title": "Modern Studio 5min from Gangnam Station",
                                                                    "thumbnail": "https://stay-oasis.s3.ap-northeast-2.amazonaws.com/null",
                                                                    "rating": 0.0,
                                                                    "price": 85000
                                                                }
                                                            }
                                                        ]
                                                    }
                                                    """
                            )
                    )
            ),
            @ApiResponse(responseCode = "401", description = "인증 필요", content = @Content),
            @ApiResponse(responseCode = "500", description = "서버 오류", content = @Content)
    })
    @GetMapping
    public ResponseEntity<BaseResponse<?>> getWishes(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ){
        List<WishResponseDto> stayCardDtoList =
                wishService.findAllByUser(userDetails.getUserUuid());
        BaseResponse<List<WishResponseDto>> body = new BaseResponse<>(stayCardDtoList);

        return ResponseEntity.status(HttpStatus.OK)
                .body(body);
    }

    @Operation(
            summary = "관심 숙소 삭제",
            description = "로그인한 사용자의 관심 숙소 항목을 삭제합니다."
    )
    @SecurityRequirement(name = "bearerAuth")
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "삭제 성공",
                    content = @Content(
                            mediaType = "application/json",
                            examples = @ExampleObject(
                                    name = "성공 예시",
                                    value = "{\n" +
                                            "  \"httpStatus\": \"OK\",\n" +
                                            "  \"isSuccess\": true,\n" +
                                            "  \"message\": \"요청에 성공하였습니다.\",\n" +
                                            "  \"code\": 200,\n" +
                                            "  \"result\": null\n" +
                                            "}"
                            )
                    )
            ),
            @ApiResponse(responseCode = "403", description = "권한 없음(본인 소유 아님)", content = @Content),
            @ApiResponse(responseCode = "404", description = "존재하지 않는 찜", content = @Content),
            @ApiResponse(responseCode = "500", description = "서버 오류", content = @Content)
    })
    @DeleteMapping("/{wishId}")
    public ResponseEntity<BaseResponse<?>> deleteWish(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long wishId
    ){

        wishService.delete(userDetails.getUserUuid(), wishId);
        BaseResponse<Void> body = new BaseResponse<>();

        return ResponseEntity.status(HttpStatus.OK)
                .body(body);
    }


}
