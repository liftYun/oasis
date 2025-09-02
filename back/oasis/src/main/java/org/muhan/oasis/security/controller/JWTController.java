package org.muhan.oasis.security.controller;

import io.jsonwebtoken.Claims;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.log4j.Log4j2;
import org.muhan.oasis.security.dto.out.CustomUserDetails;
import org.muhan.oasis.security.jwt.JWTUtil;
import org.muhan.oasis.security.service.JoinService;
import org.muhan.oasis.security.service.RefreshTokenService;
import org.muhan.oasis.security.vo.in.RegistRequestVo;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@ResponseBody
@Log4j2
@RequestMapping("/api/v1")
public class JWTController {

    private final JWTUtil jwtUtil;

    private final JoinService joinService;

    private final RefreshTokenService refreshTokenService;

    public JWTController(JWTUtil jwtUtil, JoinService joinService, RefreshTokenService refreshTokenService) {
        this.jwtUtil = jwtUtil;
        this.joinService = joinService;
        this.refreshTokenService = refreshTokenService;
    }

    @Operation(summary = "로그아웃", description = "accessToken 로그아웃", tags = {"회원"})
    @PostMapping("/logout/aToken")
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

    @Operation(summary = "로그아웃", description = "refreshToken 로그아웃", tags = {"회원"})
    @PostMapping("/logout/rToken")
    public ResponseEntity<?> logout(
            @CookieValue(name="refreshToken", required=true) String refreshToken,
            HttpServletResponse response
    ) {
        Claims claims = jwtUtil.parseClaims(refreshToken);
        System.out.println("logout to Refresh Token : " + claims);
        String uuid = claims.get("uuid", String.class);
        refreshTokenService.deleteToken(uuid);

        // 쿠키 만료 처리
        Cookie cookie = new Cookie("refreshToken", null);
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        cookie.setMaxAge(0);
        response.addCookie(cookie);
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "회원 가입", description = "회원 가입", tags = {"회원"})
    @PostMapping("/join")
    public String joinProcess(@RequestBody RegistRequestVo vo) {

        joinService.joinProcess(RegistRequestVo.from(vo));

        return "ok";
    }

}