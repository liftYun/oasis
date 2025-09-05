package org.muhan.oasis.security.controller;

import io.jsonwebtoken.Claims;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.extern.log4j.Log4j2;
import org.muhan.oasis.common.base.BaseResponse;
import org.muhan.oasis.security.dto.in.RegistRequestDto;
import org.muhan.oasis.security.dto.out.CustomUserDetails;
import org.muhan.oasis.security.entity.UserEntity;
import org.muhan.oasis.security.jwt.JWTUtil;
import org.muhan.oasis.security.service.JoinService;
import org.muhan.oasis.security.service.RefreshTokenService;
import org.muhan.oasis.security.vo.in.RegistRequestVo;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

import static org.muhan.oasis.common.base.BaseResponseStatus.DUPLICATED_NICKNAME;

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
    public ResponseEntity<?> addInformations(@AuthenticationPrincipal CustomUserDetails user,
                                             @Valid @RequestBody RegistRequestVo vo) {

        // 1) 인증 사용자 식별자
        String uuid = user.getUserUuid();

        try {
            // 2) DB 업데이트
            UserEntity updated = joinService.completeProfile(
                    uuid,
                    vo.getNickname(),
                    vo.getProfileImg(),
                    vo.getRole(),
                    vo.getLanguage()
            );

            // 3) AccessToken 재발급(닉네임/역할이 바뀌었을 수 있음)
            String newAccess = jwtUtil.createAccessToken(
                    updated.getUserUuid(),
                    updated.getEmail(),
                    updated.getNickname(),
                    updated.getRole()
            );

            // 4) 응답 (AccessToken은 헤더에만 담음)
            return ResponseEntity.ok()
                    .header("Authorization", "Bearer " + newAccess)
                    .body(Map.of(
                            "status", "SUCCESS",
                            "needProfileUpdate", false
                    ));

        } catch (JoinService.DuplicateNicknameException e) {
            return ResponseEntity.status(409).body(Map.of(
                    "status", "FAILURE",
                    "error", "DUPLICATE_NICKNAME",
                    "message", e.getMessage()
            ));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "status", "FAILURE",
                    "error", "INVALID_REQUEST",
                    "message", e.getMessage()
            ));
        }
    }

    @GetMapping("/existByNickname")
    public BaseResponse<?> existsByNicname(
            @PathVariable("nickname") String nickname,
            HttpServletResponse response) {
        if(joinService.existsByNickname(nickname)) {
            return BaseResponse.error(DUPLICATED_NICKNAME);
        } else return BaseResponse.ok();
    }
}