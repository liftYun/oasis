package org.muhan.oasis.security.controller;

import io.jsonwebtoken.Claims;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.log4j.Log4j2;
import org.muhan.oasis.common.base.BaseResponse;
import org.muhan.oasis.security.dto.out.CustomUserDetails;
import org.muhan.oasis.security.jwt.JWTUtil;
import org.muhan.oasis.security.service.CreateTokenService;
import org.muhan.oasis.security.service.CustomUserDetailsService;
import org.muhan.oasis.security.service.RefreshTokenService;
import org.muhan.oasis.security.vo.out.AccessTokenResponseVo;
import org.muhan.oasis.security.vo.out.TokenPair;
import org.muhan.oasis.user.repository.UserRepository;
import org.muhan.oasis.user.service.UserService;
import org.muhan.oasis.valueobject.Role;
import org.springframework.http.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.token.TokenService;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.stream.Collectors;

@RestController
@ResponseBody
@Log4j2
@RequestMapping("/api/v1/auth")
public class RefreshController {

    private final JWTUtil jwtUtil;
    private final RefreshTokenService refreshTokenService;
    private final CustomUserDetailsService customUserDetailsService;
    private final CreateTokenService createTokenService;
    private final UserService userService;

    public RefreshController(JWTUtil jwtUtil, RefreshTokenService refreshTokenService, CustomUserDetailsService customUserDetailsService, CreateTokenService createTokenService, UserService userService) {
        this.jwtUtil = jwtUtil;
        this.refreshTokenService = refreshTokenService;
        this.customUserDetailsService = customUserDetailsService;
        this.createTokenService = createTokenService;
        this.userService = userService;
    }

    @Operation(summary = "갱신", description = "갱신", tags = {"JWT"})
    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(
            @CookieValue(name="refreshToken", required=true) String refreshToken, HttpServletResponse response) {
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
        Role role = Role.valueOf(userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                // (여러 개라면 “ROLE_USER,ROLE_ADMIN” 식으로 합침)
                .collect(Collectors.joining(",")));
        TokenPair tokens = createTokenService.createTokens(
                uuid,
                userDetails.getEmail(),
                userDetails.getUserProfileUrl(),
                userDetails.getUserNickname(),
                role,
                userDetails.getLanguage()
        );

        response.setHeader(HttpHeaders.SET_COOKIE, tokens.refreshCookie().toString());

        return ResponseEntity.ok()
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + tokens.accessToken())
                .build();
    }

    @Operation(summary = "AT발급", description = "발급", tags = {"JWT"})
    @PostMapping("/issue")
    public ResponseEntity<?> issueAT(
            @CookieValue(name="refreshToken", required=true) String refreshToken, HttpServletResponse response) {
        // 1) 서명+만료 검사
        Claims claims = jwtUtil.parseClaims(refreshToken);
        String uuid = claims.get("uuid", String.class);

        // 2) DB에 저장된 토큰과 일치하는지 확인
        if (!refreshTokenService.isValid(uuid, refreshToken)) {
            // refreshToken이 DB에 저장된 값과 다르므로 예외 상황
            // 저장된 토큰 삭제
            refreshTokenService.deleteToken(uuid);
            // 이후 방침에 따라 추가 인증 등 확인 요망
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }


        // 3) UserDetailsService 로부터 권한 조회
        CustomUserDetails userDetails = customUserDetailsService.loadUserByUuid(uuid);
        String profileUrl = userDetails.getUserProfileUrl();
        if (profileUrl == null || profileUrl.isBlank()) {
            profileUrl = userService.getUserEmailByUuid(uuid);
        }
        // 권한 → Role 매핑 (여러 권한 대비)
        Role role = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .map(Role::valueOf)
                .findFirst()
                .orElse(Role.ROLE_GUEST);

        boolean needProfileUpdate =
                (userDetails.getRole() == null || userDetails.getUserProfileUrl() == null);

        String accessToken = jwtUtil.createAccessToken(
                userDetails.getUserUuid(),
                userDetails.getEmail(),
                profileUrl,
                userDetails.getUserNickname(),
                role,
                userDetails.getLanguage()
        );
//
//        return ResponseEntity.ok()
//                .header(HttpHeaders.AUTHORIZATION, "Bearer " + accessToken)
//                .build();

        // 교차 오리진 직접 호출 시 헤더 노출(동일 오리진 /api 프록시면 없어도 됨)
        response.setHeader("Access-Control-Expose-Headers", "Authorization");
        response.setHeader("Cache-Control", "no-store");

        // 바디에 부가 정보 같이 반환 → 프론트 라우팅에 활용
        Map<String, Object> payload = Map.of(
                "needProfileUpdate", needProfileUpdate,
                "nextUrl", needProfileUpdate ? "/register" : "/",
                "uuid", uuid,
                "email", userDetails.getEmail(),
                "nickname", userDetails.getUserNickname(),
                "profileUrl", profileUrl,
                "role", role
        );

        return ResponseEntity.ok()
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + accessToken)
                .contentType(MediaType.APPLICATION_JSON)
                .body(payload);
    }
}
