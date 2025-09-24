package org.muhan.oasis.stay.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.Parameters;
import io.swagger.v3.oas.annotations.headers.Header;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.muhan.oasis.common.base.BaseResponse;
import org.muhan.oasis.common.base.BaseResponseStatus;
import org.muhan.oasis.openAI.dto.in.StayRequestDto;
import org.muhan.oasis.openAI.service.SqsSendService;
import org.muhan.oasis.s3.service.S3StorageService;
import org.muhan.oasis.security.dto.out.CustomUserDetails;
import org.muhan.oasis.stay.dto.in.*;
import org.muhan.oasis.stay.dto.out.*;
import org.muhan.oasis.stay.entity.RegionEngEntity;
import org.muhan.oasis.stay.entity.RegionEntity;
import org.muhan.oasis.stay.repository.RegionEngRepository;
import org.muhan.oasis.stay.repository.RegionRepository;
import org.muhan.oasis.stay.service.StayService;
import org.muhan.oasis.stay.vo.out.DetailsOfStayResponseVo;
import org.muhan.oasis.user.service.UserService;
import org.muhan.oasis.user.vo.out.CancellationPolicyResponseVo;
import org.muhan.oasis.valueobject.Language;
import org.muhan.oasis.valueobject.Role;
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

        String userUuid = userDetails.getUserUuid();
        StayResponseDto stayDto = stayService.registStay(stayRequest, userUuid);

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
    @PutMapping("/{stayId}")
    public ResponseEntity<BaseResponse<StayReadResponseDto>> updateStay(
            @PathVariable Long stayId,
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestBody UpdateStayRequestDto stayRequest
    ){
        StayReadResponseDto stayResponse = stayService.updateStay(stayId, stayRequest, userDetails.getUserUuid());

        BaseResponse<StayReadResponseDto> body = new BaseResponse<>(stayResponse);
        return ResponseEntity.status(HttpStatus.OK)
                .body(body);
    }

    @Operation(
            summary = "숙소 삭제",
            description = "사용자의 숙소(stay)를 삭제합니다."
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
            @ApiResponse(responseCode = "401", description = "인증 필요", content = @Content),
            @ApiResponse(responseCode = "403", description = "권한 없음(본인 소유 아님)", content = @Content),
            @ApiResponse(responseCode = "404", description = "존재하지 않는 숙소", content = @Content),
    })
    @DeleteMapping("/{stayId}")
    public BaseResponse<Void> deleteStay(
            @PathVariable Long stayId,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ){
        stayService.deleteStay(stayId, userDetails.getUserUuid());
        return BaseResponse.ok();
    }


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
    public ResponseEntity<BaseResponse<DetailsOfStayResponseVo>> readStay(
            @PathVariable Long stayId,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ){
        DetailsOfStayResponseVo stayResponse = stayService.getStayById(stayId, userDetails.getLanguage());
        BaseResponse<DetailsOfStayResponseVo> body = new BaseResponse<>(stayResponse);
        return ResponseEntity.status(HttpStatus.OK)
                .body(body);
    }

    @SecurityRequirement(name = "bearerAuth")
    @Operation(
            summary = "숙소 이미지 업로드 URL 발급",
            description = """
        주어진 이미지 목록에 대해 S3 업로드용 **Pre-signed PUT URL**을 발급합니다.
        - `contentType`은 반드시 `image/*` 여야 합니다.
        - URL 유효기간은 10분입니다.
        - 응답의 `key`는 업로드 완료 후 공개 URL(`publicUrl`)을 구성하는 데 사용됩니다.
        """
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "발급 성공",
                    content = @Content(
                            mediaType = "application/json",
                            examples = @ExampleObject(
                                    name = "성공 예시",
                                    value = "{\n" +
                                            "  \"httpStatus\": \"OK\",\n" +
                                            "  \"isSuccess\": true,\n" +
                                            "  \"message\": \"요청에 성공하였습니다.\",\n" +
                                            "  \"code\": 200,\n" +
                                            "  \"result\": [\n" +
                                            "    {\n" +
                                            "      \"sortOrder\": 0,\n" +
                                            "      \"key\": \"stay-image/2b9c...-uuid/0.jpg\",\n" +
                                            "      \"uploadUrl\": \"https://bucket.s3.amazonaws.com/stay-image/...&X-Amz-Signature=...\",\n" +
                                            "      \"publicUrl\": \"https://cdn.example.com/stay-image/2b9c...-uuid/0.jpg\"\n" +
                                            "    },\n" +
                                            "    {\n" +
                                            "      \"sortOrder\": 1,\n" +
                                            "      \"key\": \"stay-image/2b9c...-uuid/1.jpg\",\n" +
                                            "      \"uploadUrl\": \"https://bucket.s3.amazonaws.com/stay-image/...\",\n" +
                                            "      \"publicUrl\": \"https://cdn.example.com/stay-image/2b9c...-uuid/1.jpg\"\n" +
                                            "    }\n" +
                                            "  ]\n" +
                                            "}"
                            )
                    )
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "이미지 형식 아님(예: contentType이 image/*가 아님)",
                    content = @Content(
                            mediaType = "application/json",
                            examples = @ExampleObject(
                                    name = "NO_IMG_FORM",
                                    value = "{\n" +
                                            "  \"httpStatus\": \"BAD_REQUEST\",\n" +
                                            "  \"isSuccess\": false,\n" +
                                            "  \"message\": \"이미지 형식이 아닙니다.\",\n" +
                                            "  \"code\": 400,\n" +
                                            "  \"result\": null\n" +
                                            "}"
                            )
                    )
            ),
            @ApiResponse(responseCode = "401", description = "인증 필요", content = @Content),
            @ApiResponse(responseCode = "403", description = "권한 없음", content = @Content),
            @ApiResponse(responseCode = "404", description = "존재하지 않는 숙소", content = @Content)
    })
    @PostMapping("/photos/upload-url")
    public BaseResponse<?> createUploadUrl(
            @Parameter(hidden = true)
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestBody ImageTypeListDto imageTypeListDto
            ) {

        List<PresignedResponseDto> result = new ArrayList<>();

        String uuid = String.valueOf(java.util.UUID.randomUUID());

        for (ImageTypeRequestDto imageInfo : imageTypeListDto.imageInfos()) {
            if (imageInfo.contentType() == null || !imageInfo.contentType().startsWith("image/")) {
                return BaseResponse.error(NO_IMG_FORM);
            }

            String key = "stay-image/%s/%s/%s.%s".formatted(
                    userDetails.getUserUuid(), uuid, imageInfo.sortOrder(), contentTypeToExt(imageInfo.contentType())
            );

            Duration ttl = Duration.ofMinutes(10);

            URL uploadUrl = s3StorageService.issuePutUrl(key, imageInfo.contentType(), ttl);
            String publicUrl = s3StorageService.toPublicUrl(key);

            result.add(new PresignedResponseDto(imageInfo.sortOrder(), key, uploadUrl, publicUrl));

        }

        return BaseResponse.of(result);
    }

    @Operation(
            summary = "숙소 카드 목록 (무한스크롤)",
            description = "subRegionId/체크인·아웃으로 필터하고, lastStayId 커서로 다음 페이지를 조회합니다. 첫 페이지는 lastStayId를 생략하거나 0으로 보내세요."
    )
    @Parameters({
            @Parameter(
                    name = "lastStayId",
                    description = "이전 응답의 마지막 stayId (첫 페이지는 생략 또는 0)",
                    schema = @Schema(type = "integer", format = "int64", nullable = true, example = "12345")
            ),
            @Parameter(
                    name = "subRegionId",
                    description = "하위 지역 ID",
                    schema = @Schema(type = "integer", format = "int64", example = "73")
            ),
            @Parameter(
                    name = "checkIn",
                    description = "체크인 날짜 (ISO-8601)",
                    schema = @Schema(type = "string", format = "date", example = "2025-10-01")
            ),
            @Parameter(
                    name = "checkout",
                    description = "체크아웃 날짜 (ISO-8601, checkIn보다 이후)",
                    schema = @Schema(type = "string", format = "date", example = "2025-10-03")
            )
    })
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "조회 성공",
                    content = @Content(
                            mediaType = "application/json",
                            examples = @ExampleObject(
                                    name = "성공 응답",
                                    value = "{\n" +
                                            "  \"httpStatus\": \"OK\",\n" +
                                            "  \"isSuccess\": true,\n" +
                                            "  \"message\": \"요청에 성공하였습니다.\",\n" +
                                            "  \"code\": 200,\n" +
                                            "  \"result\": [\n" +
                                            "    { \"stayId\": 101, \"title\": \"강남역 5분 모던 스튜디오\", \"thumbnail\": \"stays/2025/09/15/gn-001/main.jpg\", \"rating\": 4.85, \"price\": 85000 }\n" +
                                            "  ]\n" +
                                            "}"
                            )
                    )
            ),
            @ApiResponse(responseCode = "400", description = "잘못된 요청(날짜 범위 등)", content = @Content)
    })
    @GetMapping
    public ResponseEntity<BaseResponse<?>> searchStay(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestParam(defaultValue = "0") Long lastStayId,
            @ModelAttribute StayQueryRequestDto stayQuery
            ){

        Long cursor = (lastStayId == null || lastStayId <= 0) ? null : lastStayId;

        List<StayCardDto> stays = stayService.searchStay(cursor, stayQuery, userDetails.getUserUuid());

        BaseResponse<List<StayCardDto>> body = new BaseResponse<>(stays);

        return ResponseEntity.status(HttpStatus.OK)
                .body(body);
    }

    @GetMapping("/mystay")
    public ResponseEntity<BaseResponse<?>> findMyStays(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ){
        if(userDetails.getRole() == Role.ROLE_GUEST)
            return ResponseEntity.badRequest().body(BaseResponse.error(NO_ACCESS_AUTHORITY));

        List<StayCardView> stays = stayService.findMyStays(userDetails.getUserUuid());

        BaseResponse<List<StayCardView>> body = new BaseResponse<>(stays);

        return ResponseEntity.status(HttpStatus.OK)
                .body(body);
    }

    @Operation(
            summary = "위시 많은 순 Top 12",
            description = "위시 수가 많은 숙소 12개를 반환합니다."
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "조회 성공",
                    content = @Content(
                            mediaType = "application/json",
                            examples = @ExampleObject(
                                    name = "성공 응답",
                                    value = "{\n" +
                                            "  \"httpStatus\": \"OK\",\n" +
                                            "  \"isSuccess\": true,\n" +
                                            "  \"message\": \"요청에 성공하였습니다.\",\n" +
                                            "  \"code\": 200,\n" +
                                            "  \"result\": [\n" +
                                            "    { \"stayId\": 40, \"title\": \"해운대 오션뷰 콘도\", \"thumbnail\": \"stays/2025/09/15/bs-004/main.jpg\", \"rating\": 4.92, \"price\": 158000, \"wishCount\": 327 }\n" +
                                            "  ]\n" +
                                            "}"
                            )
                    )
            ),
            @ApiResponse(responseCode = "401", description = "인증 필요", content = @Content),
            @ApiResponse(responseCode = "500", description = "서버 오류", content = @Content)
    })
    @GetMapping("/rank/wish")
    public ResponseEntity<BaseResponse<?>> searchStayByWish(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ){
        List<StayCardByWishView> stays = stayService.searchStayByWish(userDetails.getUserUuid());

        BaseResponse<List<StayCardByWishView>> body = new BaseResponse<>(stays);

        return ResponseEntity.status(HttpStatus.OK)
                .body(body);
    }

    @Operation(
            summary = "별점 높은 순 Top 12",
            description = "평균 평점이 높은 숙소 12개를 반환합니다. (동점 시 최신 stayId 우선)"
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "조회 성공",
                    content = @Content(
                            mediaType = "application/json",
                            examples = @ExampleObject(
                                    name = "성공 응답",
                                    value = "{\n" +
                                            "  \"httpStatus\": \"OK\",\n" +
                                            "  \"isSuccess\": true,\n" +
                                            "  \"message\": \"요청에 성공하였습니다.\",\n" +
                                            "  \"code\": 200,\n" +
                                            "  \"result\": [\n" +
                                            "    { \"stayId\": 128, \"title\": \"City-View Residence\", \"thumbnail\": \"stays/2025/09/15/bs-003/main.jpg\", \"rating\": 4.95, \"price\": 98000 }\n" +
                                            "  ]\n" +
                                            "}"
                            )
                    )
            ),
            @ApiResponse(responseCode = "401", description = "인증 필요", content = @Content),
            @ApiResponse(responseCode = "500", description = "서버 오류", content = @Content)
    })
    @GetMapping("/rank/rating")
    public ResponseEntity<BaseResponse<?>> searchStayByRating(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ){
        List<StayCardView> stays = stayService.searchStayByRating(userDetails.getUserUuid());

        BaseResponse<List<StayCardView>> body = new BaseResponse<>(stays);

        return ResponseEntity.status(HttpStatus.OK)
                .body(body);
    }

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
    public ResponseEntity<BaseResponse<?>> translateStay(
            @RequestBody StayRequestDto stayRequest,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ){

        StayTranslateIdDto uuid = sqsSendService.sendStayTransMessage(stayRequest, userDetails.getUserNickname());
        BaseResponse<StayTranslateIdDto> body = BaseResponse.of(uuid);
        return ResponseEntity.status(HttpStatus.OK)
                .body(body);
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

    @PostMapping("/chatList")
    public ResponseEntity<BaseResponse<?>> getChatStays(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestBody List<StayChatRequestDto> stayChatListDto
    ){
        List<StayChatResponseDto> chatResponseDto = stayService.getStays(stayChatListDto, userDetails.getUserUuid());
        BaseResponse<List<StayChatResponseDto>> body = new BaseResponse<>(chatResponseDto);
        return ResponseEntity.status(HttpStatus.OK)
                .body(body);
    }
    @Operation(
            summary = "취소 정책 조회",
            description = """
                stayId로 등록 된 취소 정책을 조회합니다.
                """,
            tags = {"예약"}
    )
    @GetMapping("/details/cancellationPolicy/{stayId}")
    public BaseResponse<?> getCancellationPolicy(@PathVariable("stayId") Long stayId){
        CancellationPolicyResponseVo vo = userService.getCancellationPolicyByStayId(stayId);
        return BaseResponse.of(vo);
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
