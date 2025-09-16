package org.muhan.oasis.user.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.log4j.Log4j2;
import org.muhan.oasis.common.base.BaseResponse;
import org.muhan.oasis.common.base.BaseResponseStatus;
import org.muhan.oasis.s3.service.S3StorageService;
import org.muhan.oasis.security.dto.out.CustomUserDetails;
import org.muhan.oasis.security.service.CreateTokenService;
import org.muhan.oasis.security.vo.out.TokenPair;
import org.muhan.oasis.user.dto.in.CancellationPolicyRequestDto;
import org.muhan.oasis.user.dto.in.UpdateCancellationPolicyRequestDto;
import org.muhan.oasis.user.service.UserService;
import org.muhan.oasis.user.vo.in.CancellationPolicyRequestVo;
import org.muhan.oasis.user.vo.in.UpdateCancellationPolicyRequestVo;
import org.muhan.oasis.user.vo.out.UserDetailsResponseVo;
import org.muhan.oasis.user.vo.out.UserSearchResultResponseVo;
import org.muhan.oasis.valueobject.Language;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.net.URL;
import java.time.Duration;
import java.util.List;
import java.util.Map;

import static org.muhan.oasis.common.base.BaseResponseStatus.*;

@RestController
@ResponseBody
@Log4j2
@RequestMapping("/api/v1/user")
@Tag(name = "회원", description = "회원 조회/프로필 관련 API")
public class UserController {

    private final UserService userService;
    private final S3StorageService s3StorageService;
    private final CreateTokenService createTokenService;

    public UserController(UserService userService, S3StorageService s3StorageService, CreateTokenService createTokenService) {
        this.userService = userService;
        this.s3StorageService = s3StorageService;
        this.createTokenService = createTokenService;
    }

    @Operation(
            summary = "회원 오토컴플리트 검색",
            description = """
                닉네임/이름 등 키워드 기반으로 회원을 검색합니다.
                - `exclude` 파라미터로 특정 회원 ID들을 결과에서 제외할 수 있습니다.
                - 페이지네이션: page(0-base), size
                예) /api/v1/user/search?q=이도&page=0&size=10&exclude=1&exclude=2
                """,
            tags = {"회원"}
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "검색 성공")
    })
    @GetMapping("/search")
    public BaseResponse<UserSearchResultResponseVo> search(
            @Parameter(description = "검색 키워드", required = true, example = "이도")
            @PathVariable("q") String keyword,
            @Parameter(description = "페이지(0-base)", example = "0")
            @PathVariable("page") int page,
            @Parameter(description = "페이지 크기", example = "10")
            @PathVariable("size") int size,
            @Parameter(description = "결과에서 제외할 회원 ID 목록", example = "1,2")
            @RequestParam(value = "exclude", required = false) List<Long> excludeIds
    ) {
        UserSearchResultResponseVo result = userService.autocomplete(keyword, page, size, excludeIds);
        return BaseResponse.of(result);
    }

    @Operation(
            summary = "닉네임 정확 매칭 조회",
            description = "닉네임으로 정확 매칭되는 회원의 ID를 반환합니다.",
            tags = {"회원"}
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "조회 성공")
    })
    @GetMapping("/by-nickname/{nickname}")
    public BaseResponse<Long> getByNickname(
            @Parameter(description = "정확 매칭할 닉네임", required = true, example = "muhan")
            @PathVariable String nickname) {
        Long userId = userService.getUserIdByExactNickname(nickname);
        return BaseResponse.of(userId);
    }

    @Operation(
            summary = "내 정보 조회",
            description = "현재 로그인한 회원의 상세 정보를 조회합니다.",
            tags = {"회원"}
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "조회 성공"),
            @ApiResponse(responseCode = "401", description = "인증 필요")
    })
    @GetMapping("/mypage")
    public BaseResponse<?> mypage(@AuthenticationPrincipal CustomUserDetails userDetails) {
        Long userId = userService.getUserIdByExactNickname(userDetails.getUserNickname());

        return BaseResponse.of(UserDetailsResponseVo.from(userService.getUser(userId)));
    }

    @Operation(
            summary = "프로필 이미지 업로드 URL 발급",
            description = """
            프로필 이미지를 S3에 직접 업로드하기 위한 presigned URL을 발급합니다.
            사용 흐름:
            1) 본 API 호출(예: /profileImg/upload-url/image/png) → { key, uploadUrl, publicUrl } 수신
            2) 프론트가 PUT {uploadUrl} 로 S3에 업로드(요청 헤더 Content-Type 반드시 일치)
            3) 업로드 후 PUT /api/v1/user/profileImg?key=... 호출로 최종 반영
            """,
            tags = {"회원"}
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "URL 발급 성공"),
            @ApiResponse(responseCode = "400", description = "이미지 MIME 아님"),
            @ApiResponse(responseCode = "401", description = "인증 필요")
    })
    @PostMapping("/profileImg/upload-url/{type}/{subtype}")
    public BaseResponse<?> createUploadUrl(
            @Parameter(hidden = true)
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Parameter(description = "MIME 타입의 상위 타입 (예: image)", required = true, example = "image")
            @PathVariable("type") String type,
            @Parameter(description = "MIME 타입의 하위 타입 (예: png, jpeg, webp)", required = true, example = "png")
            @PathVariable("subtype") String subtype
    ) {
        final String contentType = type + "/" + subtype;

        if (!type.equalsIgnoreCase("image")) {
            return BaseResponse.error(NO_IMG_FORM); // 프로젝트 공통 에러코드
        }

        String userUuid = userDetails.getUserUuid();
        String key = "users/%s/profile/%s.%s".formatted(
                userUuid, java.util.UUID.randomUUID(), contentTypeToExt(contentType)
        );

        Duration ttl = Duration.ofMinutes(10); // Presigned URL TTL
        URL uploadUrl = s3StorageService.issuePutUrl(key, contentType, ttl);
        String publicUrl = s3StorageService.toPublicUrl(key);

        return BaseResponse.of(Map.of(
                "uploadUrl", uploadUrl.toString(),
                "publicUrl", publicUrl,
                "key", key
        ));
    }

    @Operation(
            summary = "프로필 이미지 최종 반영",
            description = """
            presigned URL로 업로드가 완료된 **S3 key**를 PathVariable 로 전달해
            최종적으로 DB에 반영합니다.
            - 서버는 key가 본인 경로(`users/{userUuid}/profile/..`)인지 검증
            - S3 객체가 실제로 존재하는지 HEAD로 검증
            - 검증 후 publicUrl을 생성하여 DB에 저장
            """,
            tags = {"회원"}
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "프로필 반영 성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 key 또는 업로드 미완료"),
            @ApiResponse(responseCode = "401", description = "인증 필요")
    })
    @PutMapping("/profileImg")
    public BaseResponse<?> setProfileImg(
            @Parameter(hidden = true)
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Parameter(
                    description = "presigned 업로드 완료 후의 S3 key (예: users/{uuid}/profile/xxx.png)",
                    required = true,
                    example = "users/7b1f...-uuid/profile/550e8400-e29b-41d4-a716-446655440000.png"
            )
            @RequestParam("key") String key
    ) {
        final String userUuid = userDetails.getUserUuid();

        if (key == null || key.isBlank() || key.contains("..")) {
            return BaseResponse.error(BaseResponseStatus.INVALID_PARAMETER);
        }

        // 1) 본인의 경로만 허용
        String requiredPrefix = "users/" + userUuid + "/profile/";
        if (key == null || !key.startsWith(requiredPrefix)) {
            return BaseResponse.error(INVALID_PARAMETER);
        }

        // 2) 업로드 완료 여부(S3 HEAD) 검증
        if (!s3StorageService.exists(key)) {
            return BaseResponse.error(NO_IMG_DATA);
        }

        // 3) 퍼블릭 URL 생성
        String publicUrl = s3StorageService.toPublicUrl(key);
        Long userId = userService.getUserIdByUserUuid(userUuid);

        // 4) DB 반영
        userService.updateProfileImageUrl(userId, publicUrl);

        return BaseResponse.of(Map.of("profileImgUrl", publicUrl));
    }


    @PatchMapping("/updateLang/{language}")
    @Schema(allowableValues = {"KOR","ENG"})
    @Operation(
            summary = "사용자 언어 설정 수정(PATCH)",
            description = "요청한 언어 코드로 사용자 언어를 부분 업데이트합니다. 예: language=KOR|ENG"
    )
    public ResponseEntity<BaseResponse<?>> updateLang(
            @AuthenticationPrincipal CustomUserDetails customUserDetails,
            @PathVariable(name = "language") String language,
            HttpServletResponse response
    ) {
        Long userId = userService.getUserIdByUserUuid(customUserDetails.getUserUuid());
        // language parsing
        Language lang = Language.valueOf(language);

        // update new Language
        userService.updateLang(userId, lang);

        // create new AT / RT
        TokenPair tokens = createTokenService.createTokens(
                customUserDetails.getUserUuid(),
                customUserDetails.getEmail(),
                customUserDetails.getUserProfileUrl(),
                customUserDetails.getUserNickname(),
                customUserDetails.getRole(),
                lang
        );

        return ResponseEntity.ok()
                .header("Authorization", "Bearer " + tokens.accessToken())
                .header(HttpHeaders.SET_COOKIE, tokens.refreshCookie().toString())
                .body(BaseResponse.ok());
    }

    @PostMapping("/regist/cancellationPolicy")
    @PreAuthorize("hasRole('ROLE_HOST')")
    @Operation(
            summary = "호스트 취소 정책 등록(POST)",
            description = "호스트가 호스팅 중인 숙소의 예약 취소 정책을 등록하여 일괄적으로 적용토록 합니다."
    )
    public BaseResponse<?> registCancellationPolicy(
            @AuthenticationPrincipal CustomUserDetails customUserDetails,
            @RequestBody CancellationPolicyRequestVo vo
    ){
        Long userId = userService.getUserIdByUserUuid(customUserDetails.getUserUuid());
        userService.registCancellationPolicy(userId, CancellationPolicyRequestDto.from(vo));
        return BaseResponse.ok();
    }

    @PutMapping("/update/cancellationPolicy")
    @PreAuthorize("hasRole('ROLE_HOST')")
    @Operation(
            summary = "호스트 취소 정책 수정(PUT)",
            description = "호스트가 호스팅 중인 숙소의 예약 취소 정책을 수정하여 일괄적으로 적용토록 합니다."
    )
    public BaseResponse<?> updateCancellationPolicy(
            @AuthenticationPrincipal CustomUserDetails customUserDetails,
            @RequestBody UpdateCancellationPolicyRequestVo vo
    ){
        Long userId = userService.getUserIdByUserUuid(customUserDetails.getUserUuid());
        userService.updateCancellationPolicy(userId, UpdateCancellationPolicyRequestDto.from(vo));
        return BaseResponse.ok();
    }


    // 파일 확장자
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
