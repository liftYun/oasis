package org.muhan.oasis.stay.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.headers.Header;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;
import org.muhan.oasis.common.base.BaseResponse;
import org.muhan.oasis.security.dto.out.CustomUserDetails;
import org.muhan.oasis.stay.dto.in.CreateStayRequestDto;
import org.muhan.oasis.stay.dto.out.StayCreateResponseDto;
import org.muhan.oasis.stay.dto.out.StayReadResponseDto;
import org.muhan.oasis.stay.service.StayService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.net.URI;

import static org.muhan.oasis.common.base.BaseResponseStatus.CREATED;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/stay")
public class StayController {

    private StayService stayService;

    // 숙소 등록 + 도어락 등록
    @Operation(
            summary = "숙소 등록",
            description = """
        신규 숙소를 등록합니다.
        - 제목/설명/상세주소는 자동 번역(ko/en) 저장
        - 초기 예약 불가 기간은 [start, end) 범위로 처리
        """,
            tags = {"숙소"},
            operationId = "createStay",
            requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    required = true,
                    content = @Content(schema = @Schema(implementation = CreateStayRequestDto.class))
            )
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "201",
                    description = "숙소 생성됨",
                    headers = {
                            @Header(name = "Location", description = "생성된 숙소 조회 URI", schema = @Schema(type = "string"))
                    },
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = StayCreateResponseDto.class))
            ),
            @ApiResponse(responseCode = "400", description = "잘못된 요청(필드 검증 실패 등)"),
            @ApiResponse(responseCode = "404", description = "하위지역/취소정책 등 존재하지 않음"),
    })
    @PostMapping
    public ResponseEntity<BaseResponse<Void>> createStay(
            CreateStayRequestDto stayRequest,
            @AuthenticationPrincipal CustomUserDetails userDetails){

        StayCreateResponseDto stayDto = stayService.registStay(stayRequest, userDetails.getUserId());

        URI location = URI.create("/api/v1/stay/" + stayDto.stayId());


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

    // 숙소 수정

    // 숙소 삭제

    // 숙소 상세글 조회
    @Operation(
            summary = "숙소 상세 조회",
            description = """
        숙소 ID로 상세 정보를 조회합니다.
        - 사용자 언어 선호에 따라 제목/설명 등의 번역 필드가 포함될 수 있습니다.
        """,
            tags = {"숙소"},
            operationId = "getStayById"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "조회 성공", useReturnTypeSchema = true),
            @ApiResponse(responseCode = "404", description = "숙소가 존재하지 않음", content = @Content),
    })
    @GetMapping("/{stayId}")
    public ResponseEntity<BaseResponse<StayReadResponseDto>> readStay(
            @PathVariable Long stayId,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ){
        StayReadResponseDto stayResponse = stayService.getStayById(stayId, userDetails.getLanguage());
        BaseResponse<StayReadResponseDto> body = new BaseResponse<>(stayResponse);
        return ResponseEntity.status(HttpStatus.OK)
                .body(body);
    }

    // 숙소 사진 업로드 (여러장)

    // 숙소 검색

}
