package org.muhan.oasis.security.controller;

import io.jsonwebtoken.Claims;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.log4j.Log4j2;
import org.muhan.oasis.security.dto.out.CustomUserDetails;
import org.muhan.oasis.security.jwt.JWTUtil;
import org.muhan.oasis.security.service.CustomUserDetailsService;
import org.muhan.oasis.security.service.RefreshTokenService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.*;

import java.util.stream.Collectors;

@RestController
@ResponseBody
@Log4j2
@RequestMapping("/api/v1")
public class RefreshController {

    private final JWTUtil jwtUtil;
    private final RefreshTokenService refreshTokenService;
    private final CustomUserDetailsService customUserDetailsService;

    public RefreshController(JWTUtil jwtUtil, RefreshTokenService refreshTokenService, CustomUserDetailsService customUserDetailsService) {
        this.jwtUtil = jwtUtil;
        this.refreshTokenService = refreshTokenService;
        this.customUserDetailsService = customUserDetailsService;
    }

    @Operation(summary = "갱신", description = "갱신", tags = {"JWT"})
    @PostMapping("/refresh")
    public ResponseEntity<Void> refreshToken(
            @CookieValue(name="refreshToken", required=true) String refreshToken, HttpServletResponse response) {
        System.out.println("refresh controller start");
        // 1) 서명+만료 검사
        Claims claims = jwtUtil.parseClaims(refreshToken);
//        Integer userId = claims.get("userId", Integer.class);
        String uuid = claims.get("uuid", String.class);
//        System.out.println("Refresh Controller's uuid : "+ uuid);

        // 2) DB에 저장된 토큰과 일치하는지 확인
        if (!refreshTokenService.isValid(uuid, refreshToken)) {
            // refreshToken이 DB에 저장된 값과 다르므로 예외 상황
//            System.out.println("Before to delete Token : "+uuid);
            // 저장된 토큰 삭제
            refreshTokenService.deleteToken(uuid);
//            System.out.println("delete RefreshToken");
            // 이후 방침에 따라 추가 인증 등 확인 요망

            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }


        // 3) UserDetailsService 로부터 권한 조회
//        UserDetails userDetails = customUserDetailsService.loadUserByUuid(uuid);
        CustomUserDetails userDetails = customUserDetailsService.loadUserByUuid(uuid);
        String role = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                // (여러 개라면 “ROLE_USER,ROLE_ADMIN” 식으로 합침)
                .collect(Collectors.joining(","));
        String newRefreshToken = jwtUtil.createRefreshToken(uuid);

        refreshTokenService.saveToken(uuid, newRefreshToken);
        Cookie cookie = new Cookie("refreshToken", newRefreshToken);
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        cookie.setMaxAge((int)(jwtUtil.getRefreshExpiredMs()/1000));
        response.addCookie(cookie);

//        System.out.println("RefreshController userEmail : " + userDetails.getUserEmail());
//        System.out.println("RefreshController username : " + userDetails.getUserNickname());
        String newAccessToken = jwtUtil.createAccessToken(uuid, userDetails.getUserEmail(), userDetails.getUserNickname(), role);

        return ResponseEntity.ok()
                .header("Authorization", "Bearer " + newAccessToken)
                .build();
    }
}
