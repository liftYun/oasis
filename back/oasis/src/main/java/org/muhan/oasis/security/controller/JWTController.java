package org.muhan.oasis.security.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.extern.log4j.Log4j2;
import org.muhan.oasis.common.base.BaseResponse;
import org.muhan.oasis.common.base.BaseResponseStatus;
import org.muhan.oasis.s3.service.S3StorageService;
import org.muhan.oasis.security.dto.out.CustomUserDetails;
import org.muhan.oasis.user.entity.UserEntity;
import org.muhan.oasis.security.jwt.JWTUtil;
import org.muhan.oasis.security.service.JoinService;
import org.muhan.oasis.security.service.RefreshTokenService;
import org.muhan.oasis.security.vo.in.RegistRequestVo;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import static org.muhan.oasis.common.base.BaseResponseStatus.*;

@RestController
@ResponseBody
@Log4j2
@RequestMapping("/api/v1/auth")
public class JWTController {
    @Value("${cloud.aws.s3.bucket}") private String bucket;

    private final JWTUtil jwtUtil;

    private final JoinService joinService;

    private final RefreshTokenService refreshTokenService;

    private final S3StorageService s3StorageService;

    public JWTController(JWTUtil jwtUtil, JoinService joinService, RefreshTokenService refreshTokenService, S3StorageService s3StorageService) {
        this.jwtUtil = jwtUtil;
        this.joinService = joinService;
        this.refreshTokenService = refreshTokenService;
        this.s3StorageService = s3StorageService;
    }

    @Operation(
            summary = "로그아웃",
            description = """
                회원 로그아웃 처리:
                - 서버에 저장된 Refresh Token을 폐기합니다.
                - 브라우저의 refreshToken 쿠키를 만료합니다( Max-Age=0, HttpOnly, Path=/ ).
                """,
            tags = {"회원"}
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "성공적으로 로그아웃됨")
    })
    @SecurityRequirement(name = "bearerAuth")
    @PostMapping("/logout")
    public ResponseEntity<?> logout(
            @Parameter(hidden = true)
            @AuthenticationPrincipal CustomUserDetails user,
            HttpServletResponse response
    ) {
        refreshTokenService.deleteToken(user.getUserUuid());
        // 쿠키 만료 처리
        Cookie cookie = new Cookie("refreshToken", null);
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        cookie.setMaxAge(0);
        response.addCookie(cookie);
        return ResponseEntity.ok().build();
    }

    @Operation(
            summary = "초기 가입 추가정보 저장",
            description = """
                소셜 로그인 직후, 회원의 **닉네임/역할/언어/프로필 이미지**를 한 번에 저장합니다.
                
                ### 프로필 이미지 업로드 흐름(권장)
                1) `/api/v1/user/profileImg/upload-url`로 presigned URL 발급 (key/ uploadUrl/ publicUrl 수신)
                2) 프론트에서 `PUT uploadUrl`로 S3에 직접 업로드
                3) 본 API 호출 시 `profileImgKey`(또는 `profileImgUrl`)를 함께 전달
                   - 서버가 key의 소유자 경로(`users/{userUuid}/profile/`)인지 검증
                   - S3에 실제 객체 존재 여부를 HEAD로 검증
                   - 검증 후 URL을 DB에 반영하고 Access Token을 재발급(응답 헤더 Authorization)
                
                ### Request Body 예시
                {
                  "nickname": "도윤",
                  "role": "ROLE_GUEST",
                  "language": "kor",
                  "profileImgKey": "users/7b1f.../profile/550e8400-...png"
                }
                """,
            tags = {"회원"}
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "정상 처리 및 Access Token 재발급(헤더)"),
            @ApiResponse(responseCode = "400", description = "유효하지 않은 입력값"),
            @ApiResponse(responseCode = "409", description = "닉네임 중복"),
            @ApiResponse(responseCode = "500", description = "서버 내부 오류")
    })
    @SecurityRequirement(name = "bearerAuth")
    @PutMapping("/addInformations")
    public BaseResponse<Void> addInformations(
            @Parameter(hidden = true)
            @AuthenticationPrincipal CustomUserDetails user,
            @Valid @RequestBody RegistRequestVo vo,
            HttpServletResponse response) {

        final String uuid = user.getUserUuid();
        String finalProfileUrl = null;
        String key = null;

        try {
            // 0) 프로필 이미지 결정
            if (vo.getProfileImgKey() != null && !vo.getProfileImgKey().isBlank()) {
                key = vo.getProfileImgKey();
                String requiredPrefix = "users/" + uuid + "/profile/";
                if (!key.startsWith(requiredPrefix)) {
                    return BaseResponse.error(INVALID_PARAMETER);
                }
                if (!s3StorageService.exists(key)) {
                    return BaseResponse.error(NO_IMG_DATA); // 업로드 미완료
                }
                finalProfileUrl = s3StorageService.toPublicUrl(key);

            } else if (vo.getProfileImgUrl() != null && !vo.getProfileImgUrl().isBlank()) {
                String url = vo.getProfileImgUrl();
                if (!isAllowedPublicUrl(url)) {
                    return BaseResponse.error(INVALID_PARAMETER);
                }
                finalProfileUrl = url;
            } // else: 기본이미지 정책에 따라 null 허용
            // 1) DB 업데이트
            UserEntity updated = joinService.completeProfile(
                    uuid,
                    vo.getNickname(),
                    key,
                    finalProfileUrl,
                    vo.getRole(),
                    vo.getLanguage()
            );

            // 2) AccessToken 재발급 (헤더 ONLY)
            String newAccess = jwtUtil.createAccessToken(
                    updated.getUserUuid(),
                    updated.getProfileUrl(),
                    updated.getNickname(),
                    updated.getRole(),
                    updated.getLanguage()
            );
            response.addHeader("Authorization", "Bearer " + newAccess);

            // 3) 바디는 표준 래퍼로 성공 응답만
            return BaseResponse.ok();

        } catch (JoinService.DuplicateNicknameException e) {
            return BaseResponse.error(DUPLICATED_NICKNAME);
        } catch (IllegalArgumentException e) {
            return BaseResponse.error(INVALID_PARAMETER);
        } catch (Exception e) {
            log.error("addInformations error", e);
            return BaseResponse.error(BaseResponseStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Operation(
            summary = "닉네임 중복 여부 확인",
            description = """
                닉네임의 사용 가능 여부를 확인합니다.
                - 중복이면 `DUPLICATED_NICKNAME` 에러를 반환
                - 사용 가능하면 200 OK
                """,
            tags = {"회원"}
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "사용 가능"),
            @ApiResponse(responseCode = "409", description = "닉네임 중복")
    })
    @GetMapping("/existByNickname/{nickname}")
    public BaseResponse<?> existsByNicname(
            @Parameter(description = "중복 여부 확인할 닉네임", required = true, example = "muhan")
            @PathVariable("nickname") String nickname) {
        return joinService.existsByNickname(nickname)
                ? BaseResponse.error(DUPLICATED_NICKNAME)
                : BaseResponse.ok();
    }

    /** CloudFront/S3 도메인만 허용 (URL 인젝션 방지) */
    private boolean isAllowedPublicUrl(String url) {
        try {
            var host = java.net.URI.create(url).getHost();
            if (host == null) return false;
            // CloudFront 또는 S3만 허용
            if (host.endsWith(".cloudfront.net")) return true;
            return host.equals(bucket + ".s3.amazonaws.com");
        } catch (Exception e) {
            return false;
        }
    }
}