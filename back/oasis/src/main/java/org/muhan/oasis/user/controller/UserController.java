package org.muhan.oasis.user.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.persistence.EntityNotFoundException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.log4j.Log4j2;
import org.muhan.oasis.common.base.BaseResponse;
import org.muhan.oasis.s3.service.S3StorageService;
import org.muhan.oasis.security.dto.out.CustomUserDetails;
import org.muhan.oasis.security.jwt.JWTUtil;
import org.muhan.oasis.security.service.RefreshTokenService;
import org.muhan.oasis.user.service.UserService;
import org.muhan.oasis.user.vo.out.UserDetailsResponseVo;
import org.muhan.oasis.user.vo.out.UserSearchResultResponseVo;
import org.muhan.oasis.valueobject.Language;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
    private final JWTUtil jwtUtil;
    private final RefreshTokenService refreshTokenService;

    public UserController(UserService userService, S3StorageService s3StorageService, JWTUtil jwtUtil, RefreshTokenService refreshTokenService) {
        this.userService = userService;
        this.s3StorageService = s3StorageService;
        this.jwtUtil = jwtUtil;
        this.refreshTokenService = refreshTokenService;
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
            @RequestParam("q") String keyword,
            @Parameter(description = "페이지(0-base)", example = "0")
            @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "페이지 크기", example = "10")
            @RequestParam(defaultValue = "10") int size,
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
    @SecurityRequirement(name = "bearerAuth")
    @GetMapping("/mypage")
    public BaseResponse<?> mypage(@AuthenticationPrincipal CustomUserDetails userDetails) {
        return BaseResponse.of(UserDetailsResponseVo.from(userService.getUser(userDetails.getUserId())));
    }

    @Operation(
            summary = "프로필 이미지 업로드 URL 발급",
            description = """
                프로필 이미지를 S3에 직접 업로드하기 위한 **presigned URL**을 발급합니다.
                사용 흐름:
                1) 본 API 호출(`contentType=image/png`) → { key, uploadUrl, publicUrl } 수신
                2) 프론트가 `PUT uploadUrl`로 S3에 업로드(`Content-Type` 일치)
                3) 업로드 후 `PUT /api/v1/user/profileImg?key=...` 호출로 최종 반영
                """,
            tags = {"회원"}
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "URL 발급 성공"),
            @ApiResponse(responseCode = "400", description = "이미지 MIME 아님"),
            @ApiResponse(responseCode = "401", description = "인증 필요")
    })
    @SecurityRequirement(name = "bearerAuth")
    @PostMapping("/profileImg/upload-url")
    public BaseResponse<?> createUploadUrl(
            @Parameter(hidden = true)
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Parameter(description = "이미지 MIME 타입", required = true, example = "image/png")
            @RequestParam("contentType") String contentType) {

        if (contentType == null || !contentType.startsWith("image/")) {
            return BaseResponse.error(NO_IMG_FORM);
        }

        String userUuid = userDetails.getUserUuid();

        String key = "users/%s/profile/%s.%s".formatted(
                userUuid, java.util.UUID.randomUUID(), contentTypeToExt(contentType)
        );

        // TTL: 10분
        Duration ttl = Duration.ofMinutes(10);

        URL uploadUrl = s3StorageService.issuePutUrl(key, contentType, ttl); // 유효기간 짧게(예: 5~10분)
//        String publicUrl = "https://%s.s3.amazonaws.com/%s".formatted(bucket, key); // 또는 CloudFront
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
                presigned URL로 업로드가 완료된 **S3 key**를 전달해 최종적으로 DB에 반영합니다.
                - 서버는 key가 본인 경로(`users/{userUuid}/profile/..`)인지 검증
                - S3에 객체가 실제로 존재하는지 HEAD로 검증
                - 검증 후 publicUrl을 생성하여 DB에 저장
                """,
            tags = {"회원"}
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "프로필 반영 성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 key 또는 업로드 미완료"),
            @ApiResponse(responseCode = "401", description = "인증 필요")
    })
    @SecurityRequirement(name = "bearerAuth")
    @PutMapping("/profileImg")
    public BaseResponse<?> setProfileImg(
            @Parameter(hidden = true)
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Parameter(description = "presigned 업로드 후의 S3 key", required = true,
                    example = "users/7b1f...-uuid/profile/550e8400-e29b-41d4-a716-446655440000.png")
            @RequestParam("key") String key
    ) {
        final String userUuid = userDetails.getUserUuid();

        // 1) 본인의 경로만 허용 (users/{userUuid}/profile/...)
        String requiredPrefix = "users/" + userUuid + "/profile/";
        if (key == null || !key.startsWith(requiredPrefix)) {
            return BaseResponse.error(INVALID_PARAMETER);
        }

        // 2) 실제로 업로드 완료되었는지 S3 HEAD로 확인
        if (!s3StorageService.exists(key)) {
            return BaseResponse.error(NO_IMG_DATA); // "업로드 미완료" 등 메시지
        }

        // 3) 퍼블릭 URL(CloudFront or S3) 생성
        String publicUrl = s3StorageService.toPublicUrl(key);

        // 4) DB 반영 (기존 이미지 삭제는 userService 내부 로직에서 처리하도록 유지)
        userService.updateProfileImageUrl(userDetails.getUserId(), publicUrl);

        return BaseResponse.of(Map.of("profileImgUrl", publicUrl));
    }

    @PatchMapping("/language")
    @Operation(
            summary = "사용자 언어 설정 수정(PATCH)",
            description = "요청한 언어 코드로 사용자 언어를 부분 업데이트합니다. 예: language=KOR|ENG"
    )
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<BaseResponse<?>> updateLang(
            @AuthenticationPrincipal CustomUserDetails customUserDetails,
            @RequestParam(name = "language") String languageParam,
            HttpServletResponse response
    ) {
        Long userId = customUserDetails.getUserId();

        // 1) 언어 파싱
        final Language lang;
        try {
            lang = Language.valueOf(languageParam.trim().toUpperCase());
        } catch (IllegalArgumentException | NullPointerException e) {
            log.warn("[updateLang] invalid language param. userId={}, param={}", userId, languageParam, e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(BaseResponse.error(INVALID_PARAMETER));
        }

        // 2) 부분 업데이트
        try {
            userService.updateLang(userId, lang);
        } catch (jakarta.persistence.EntityNotFoundException ex) {
            log.error("[updateLang] user not found. userId={}", userId, ex);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(BaseResponse.error(NO_EXIST_MEMBER));
        } catch (org.springframework.dao.DataAccessException ex) {
            log.error("[updateLang] DB access error. userId={}, lang={}", userId, lang, ex);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(BaseResponse.error(UPDATE_LANG_FAIL));
        } catch (Exception ex) {
            log.error("[updateLang] unexpected error. userId={}, lang={}", userId, lang, ex);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(BaseResponse.error(DISALLOWED_ACTION));
        }

        // 3) 토큰 재발급 (갱신된 언어 반영)
        try {
            final String uuid = customUserDetails.getUserUuid();

            // 3-1) Refresh Token 회전 + 쿠키 재설정
            String newRefreshToken = jwtUtil.createRefreshToken(uuid);
            refreshTokenService.saveToken(uuid, newRefreshToken);

            Cookie cookie = new Cookie("refreshToken", newRefreshToken);
            cookie.setHttpOnly(true);
            cookie.setPath("/");
            cookie.setMaxAge((int)(jwtUtil.getRefreshExpiredMs() / 1000));
            response.addCookie(cookie);

            // 3-2) Access Token 재발급 (언어는 반드시 업데이트된 lang 사용)
            String newAccessToken = jwtUtil.createAccessToken(
                    uuid,
                    customUserDetails.getUserProfileUrl(),
                    customUserDetails.getUserNickname(),
                    customUserDetails.getRole(),
                    lang
            );

            Map<String, Object> payload = Map.of(
                    "userId", userId,
                    "language", lang.name(),
                    "updated", true
            );

            return ResponseEntity.ok()
                    .header("Authorization", "Bearer " + newAccessToken)
                    .header("Access-Control-Expose-Headers", "Authorization")
                    .body(BaseResponse.of(payload));

        } catch (jakarta.persistence.EntityNotFoundException ex) {
            log.error("[updateLang] user details not found for token reissue. userId={}", userId, ex);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(BaseResponse.error(UPDATE_LANG_FAIL));
        } catch (Exception ex) {
            log.error("[updateLang] unexpected error on token reissue. userId={}", userId, ex);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(BaseResponse.error(UPDATE_LANG_FAIL));
        }
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
