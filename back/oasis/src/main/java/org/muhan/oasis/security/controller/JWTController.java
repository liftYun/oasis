package org.muhan.oasis.security.controller;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.extern.log4j.Log4j2;
import org.muhan.oasis.common.base.BaseResponse;
import org.muhan.oasis.common.base.BaseResponseStatus;
import org.muhan.oasis.security.dto.out.CustomUserDetails;
import org.muhan.oasis.user.entity.UserEntity;
import org.muhan.oasis.security.jwt.JWTUtil;
import org.muhan.oasis.security.service.JoinService;
import org.muhan.oasis.security.service.RefreshTokenService;
import org.muhan.oasis.security.vo.in.RegistRequestVo;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import static org.muhan.oasis.common.base.BaseResponseStatus.DUPLICATED_NICKNAME;
import static org.muhan.oasis.common.base.BaseResponseStatus.INVALID_PARAMETER;

@RestController
@ResponseBody
@Log4j2
@RequestMapping("/api/v1/auth")
public class JWTController {

    private final JWTUtil jwtUtil;

    private final JoinService joinService;

    private final RefreshTokenService refreshTokenService;

    public JWTController(JWTUtil jwtUtil, JoinService joinService, RefreshTokenService refreshTokenService) {
        this.jwtUtil = jwtUtil;
        this.joinService = joinService;
        this.refreshTokenService = refreshTokenService;
    }

    @Operation(summary = "로그아웃", description = "로그아웃", tags = {"회원"})
    @PostMapping("/logout")
    public ResponseEntity<?> logout(
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

    @PutMapping("/addInformations")
    public BaseResponse<Void> addInformations(@AuthenticationPrincipal CustomUserDetails user,
                                              @Valid @RequestBody RegistRequestVo vo,
                                              HttpServletResponse response) {

        final String uuid = user.getUserUuid();

        try {
            // 1) DB 업데이트
            UserEntity updated = joinService.completeProfile(
                    uuid,
                    vo.getNickname(),
                    vo.getProfileImg(),
                    vo.getRole(),
                    vo.getLanguage()
            );

            // 2) AccessToken 재발급 (헤더 ONLY)
            String newAccess = jwtUtil.createAccessToken(
                    updated.getUserUuid(),   // String/Long → JWTUtil 시그니처에 맞게
                    updated.getEmail(),
                    updated.getNickname(),
                    updated.getRole()
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

    @GetMapping("/existByNickname")
    public BaseResponse<?> existsByNicname(
            @PathVariable("nickname") String nickname) {
        return joinService.existsByNickname(nickname)
                ? BaseResponse.error(DUPLICATED_NICKNAME)
                : BaseResponse.ok();
    }
}