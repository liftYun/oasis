package org.muhan.oasis.wish.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
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
    @PostMapping
    public ResponseEntity<BaseResponse<?>> addWish(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestBody CreateWishRequestDto wishRequestDto
            ){

        wishService.addWish(userDetails.getUserUuid(), wishRequestDto);

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

    @GetMapping
    public ResponseEntity<BaseResponse<?>> getWishes(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ){
        List<WishResponseDto> stayCardDtoList =
                wishService.findAllByUser(userDetails.getUserUuid());
        System.out.println(stayCardDtoList);
        BaseResponse<List<WishResponseDto>> body = new BaseResponse<>(stayCardDtoList);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(body);
    }


}
