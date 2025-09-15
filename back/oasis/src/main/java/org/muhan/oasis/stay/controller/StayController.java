package org.muhan.oasis.stay.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.headers.Header;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;
import org.muhan.oasis.common.base.BaseResponse;
import org.muhan.oasis.openAI.dto.in.StayRequestDto;
import org.muhan.oasis.openAI.service.SqsSendService;
import org.muhan.oasis.s3.service.S3StorageService;
import org.muhan.oasis.security.dto.out.CustomUserDetails;
import org.muhan.oasis.stay.dto.in.CreateStayRequestDto;
import org.muhan.oasis.stay.dto.in.ImageRequestDto;
import org.muhan.oasis.stay.dto.in.ImageTypeListDto;
import org.muhan.oasis.stay.dto.in.ImageTypeRequestDto;
import org.muhan.oasis.stay.dto.out.*;
import org.muhan.oasis.stay.entity.RegionEngEntity;
import org.muhan.oasis.stay.entity.RegionEntity;
import org.muhan.oasis.stay.repository.RegionEngRepository;
import org.muhan.oasis.stay.repository.RegionRepository;
import org.muhan.oasis.stay.service.StayService;
import org.muhan.oasis.user.service.UserService;
import org.muhan.oasis.valueobject.Language;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URL;
import java.time.Duration;
import java.util.ArrayList;
import java.util.List;

import static org.muhan.oasis.common.base.BaseResponseStatus.*;


@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/stay")
public class StayController {

    private final StayService stayService;
    private final SqsSendService sqsSendService;
    private final S3StorageService s3StorageService;
    private final UserService userService;
    private final RegionRepository regionRepository;
    private final RegionEngRepository regionEngRepository;

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
                            schema = @Schema(implementation = StayResponseDto.class))
            ),
            @ApiResponse(responseCode = "400", description = "잘못된 요청(필드 검증 실패 등)"),
            @ApiResponse(responseCode = "404", description = "하위지역/취소정책 등 존재하지 않음"),
    })
    @PostMapping
    public ResponseEntity<BaseResponse<Void>> createStay(
            @RequestBody CreateStayRequestDto stayRequest,
            @AuthenticationPrincipal CustomUserDetails userDetails){

        // 1) 본인의 경로만 허용 (users/{userUuid}/profile/...)

        Long userId = userService.getUserIdByUserUuid(userDetails.getUserUuid());
        StayResponseDto stayDto = stayService.registStay(stayRequest, userId);

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
    /*@PutMapping("/{stayId}")
    public ResponseEntity<BaseResponse<StayReadResponseDto>> updateStay(
            @PathVariable Long stayId,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ){
        StayReadResponseDto stayResponse = stayService.updateStay(stayId);


        BaseResponse<StayReadResponseDto> body = new BaseResponse<>(stayResponse);
        return ResponseEntity.status(HttpStatus.OK)
                .body(body);
    }*/


    @DeleteMapping("/{stayId}")
    public ResponseEntity<BaseResponse<?>> deleteStay(
            @PathVariable Long stayId,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ){
        stayService.deleteStay(stayId, userDetails.getUserUuid());
        BaseResponse<Void> body = new BaseResponse<>();

        return ResponseEntity.status(HttpStatus.OK)
                .body(body);
    }

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


    @PostMapping("/{stayId}/photos/upload-url")
    public BaseResponse<?> createUploadUrl(
            @Parameter(hidden = true)
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestBody ImageTypeListDto imageTypeListDto
            ) {

        List<PresignedResponseDto> result = new ArrayList<>();

        for (ImageTypeRequestDto imageInfo : imageTypeListDto.imageInfos()) {
            if (imageInfo.contentType() == null || !imageInfo.contentType().startsWith("image/")) {
                return BaseResponse.error(NO_IMG_FORM);
            }

            String key = "stay-image/%s/%s/%s.%s".formatted(
                    userDetails.getUserUuid(), java.util.UUID.randomUUID(), imageInfo.sortOrder(), contentTypeToExt(imageInfo.contentType())
            );

            Duration ttl = Duration.ofMinutes(10);

            URL uploadUrl = s3StorageService.issuePutUrl(key, imageInfo.contentType(), ttl);
            String publicUrl = s3StorageService.toPublicUrl(key);

            result.add(new PresignedResponseDto(imageInfo.sortOrder(), key, uploadUrl, publicUrl));

        }

        return BaseResponse.of(result);
    }


    // 숙소 검색


    @Operation(
            summary = "숙소 번역 요청",
            description = "숙소(제목/본문 등) 번역 작업을 SQS 큐에 넣고 즉시 성공 응답을 반환합니다."
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "요청 성공",
                    content = @Content(
                            mediaType = "application/json",
                            examples = @ExampleObject(
                                    name = "간단 예시",
                                    value =
                                            "{\n" +
                                                    "  \"httpStatus\": \"OK\",\n" +
                                                    "  \"isSuccess\": true,\n" +
                                                    "  \"message\": \"요청에 성공하였습니다.\",\n" +
                                                    "  \"code\": 200,\n" +
                                                    "  \"result\": null\n" +
                                                    "}"
                            )
                    )
            )
    })
    @PostMapping("/translate")
    public ResponseEntity<BaseResponse<Void>> translateStay(
            @RequestBody StayRequestDto stayRequest,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ){

        sqsSendService.sendStayTransMessage(stayRequest, userDetails.getUserNickname());

        return ResponseEntity.status(HttpStatus.OK)
                .body(BaseResponse.ok());
    }

    @Operation(
            summary = "지역 목록 조회 (사용자 언어에 맞춰 반환)",
            description = "사용자 언어가 KOR면 한글 지역, 그 외에는 영문 지역 목록을 반환합니다."
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "조회 성공",
                    content = @Content(
                            mediaType = "application/json",
                            examples = {
                                    @ExampleObject(
                                            name = "KOR 응답 예시",
                                            value =
                                                    "{\n" +
                                                            "  \"httpStatus\": \"OK\",\n" +
                                                            "  \"isSuccess\": true,\n" +
                                                            "  \"message\": \"요청에 성공하였습니다.\",\n" +
                                                            "  \"code\": 200,\n" +
                                                            "  \"result\": [\n" +
                                                            "    {\n" +
                                                            "      \"region\": \"서울특별시\",\n" +
                                                            "      \"subRegions\": [\n" +
                                                            "        { \"id\": 1,  \"subName\": \"강남구\" },\n" +
                                                            "        { \"id\": 2,  \"subName\": \"강동구\" },\n" +
                                                            "        { \"id\": 3,  \"subName\": \"강북구\" }\n" +
                                                            "      ]\n" +
                                                            "    },\n" +
                                                            "    {\n" +
                                                            "      \"region\": \"충청남도\",\n" +
                                                            "      \"subRegions\": [\n" +
                                                            "        { \"id\": 108, \"subName\": \"천안시\" },\n" +
                                                            "        { \"id\": 116, \"subName\": \"세종시\" }\n" +
                                                            "      ]\n" +
                                                            "    },\n" +
                                                            "    {\n" +
                                                            "      \"region\": \"부산광역시\",\n" +
                                                            "      \"subRegions\": [\n" +
                                                            "        { \"id\": 26, \"subName\": \"강서구\" },\n" +
                                                            "        { \"id\": 31, \"subName\": \"부산진구\" },\n" +
                                                            "        { \"id\": 40, \"subName\": \"해운대구\" }\n" +
                                                            "      ]\n" +
                                                            "    }\n" +
                                                            "  ]\n" +
                                                            "}"
                                    ),
                                    @ExampleObject(
                                            name = "ENG 응답 예시",
                                            value =
                                                    "{\n" +
                                                            "  \"httpStatus\": \"OK\",\n" +
                                                            "  \"isSuccess\": true,\n" +
                                                            "  \"message\": \"요청에 성공하였습니다.\",\n" +
                                                            "  \"code\": 200,\n" +
                                                            "  \"result\": [\n" +
                                                            "    {\n" +
                                                            "      \"region\": \"Seoul\",\n" +
                                                            "      \"subRegions\": [\n" +
                                                            "        { \"id\": 1,  \"subName\": \"Gangnam-gu\" },\n" +
                                                            "        { \"id\": 2,  \"subName\": \"Gangdong-gu\" },\n" +
                                                            "        { \"id\": 3,  \"subName\": \"Gangbuk-gu\" }\n" +
                                                            "      ]\n" +
                                                            "    },\n" +
                                                            "    {\n" +
                                                            "      \"region\": \"Chungcheongnam\",\n" +
                                                            "      \"subRegions\": [\n" +
                                                            "        { \"id\": 108, \"subName\": \"Cheonan-si\" },\n" +
                                                            "        { \"id\": 116, \"subName\": \"Sejong-si\" }\n" +
                                                            "      ]\n" +
                                                            "    },\n" +
                                                            "    {\n" +
                                                            "      \"region\": \"Busan\",\n" +
                                                            "      \"subRegions\": [\n" +
                                                            "        { \"id\": 26, \"subName\": \"Gangseo-gu\" },\n" +
                                                            "        { \"id\": 31, \"subName\": \"Busanjin-gu\" },\n" +
                                                            "        { \"id\": 40, \"subName\": \"Haeundae-gu\" }\n" +
                                                            "      ]\n" +
                                                            "    }\n" +
                                                            "  ]\n" +
                                                            "}"
                                    )
                            }
                    )
            ),
            @ApiResponse(responseCode = "401", description = "인증 필요", content = @Content),
            @ApiResponse(responseCode = "500", description = "서버 오류", content = @Content)
    })
    @GetMapping("/region")
    private ResponseEntity<BaseResponse<?>> getAllRegion(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ){

        if(userDetails.getLanguage().equals(Language.KOR)){
            List<RegionEntity> regions = regionRepository.findAll();

            List<RegionResponseDto> regionDtos = regions.stream().map(RegionResponseDto::from).toList();
            BaseResponse<List<RegionResponseDto>> body = new BaseResponse<>(regionDtos);
            return ResponseEntity.status(HttpStatus.OK)
                    .body(body);
        }
        else{
            List<RegionEngEntity> regions = regionEngRepository.findAll();

            List<RegionEngResponseDto> regionDtos = regions.stream().map(RegionEngResponseDto::from).toList();
            BaseResponse<List<RegionEngResponseDto>> body = new BaseResponse<>(regionDtos);
            return ResponseEntity.status(HttpStatus.OK)
                    .body(body);
        }
    }

    private String contentTypeToExt(String contentType) {
        if (contentType == null) return "bin";
        String ct = contentType.toLowerCase();
        return switch (ct) {
            case "image/png" -> "png";
            case "image/jpeg", "image/jpg" -> "jpg";
            case "image/gif" -> "gif";
            case "image/webp" -> "webp";
            default -> {
                int slash = ct.lastIndexOf('/');
                if (slash >= 0 && slash < ct.length() - 1) {
                    yield ct.substring(slash + 1); // 예: image/bmp -> bmp
                }
                yield "bin";
            }
        };
    }


}
