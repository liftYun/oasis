package org.muhan.oasis.security.service;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.muhan.oasis.security.jwt.JWTUtil;
import org.muhan.oasis.security.vo.out.TokenPair;
import org.muhan.oasis.valueobject.Language;
import org.muhan.oasis.valueobject.Role;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Service;

@Service
@Log4j2
@RequiredArgsConstructor
public class CreateTokenService {
    private final JWTUtil jwtUtil;
    private final RefreshTokenService refreshTokenService;

    public TokenPair createTokens(
            String uuid,
            String profileUrl,
            String nickname,
            Role role,
            Language language) {
        String accessToken = jwtUtil.createAccessToken(uuid, profileUrl, nickname, role, language);
        String refreshToken = jwtUtil.createRefreshToken(uuid);

        refreshTokenService.saveToken(uuid, refreshToken);

        // ResponseCookie 사용: SameSite, Secure 등 명시 가능
        ResponseCookie refreshCookie = ResponseCookie.from("refreshToken", refreshToken)
                .httpOnly(true)
                .secure(true)                // HTTPS 환경에서 권장
                .sameSite("None")            // 크로스 사이트 필요 시
                .path("/")
                .maxAge(jwtUtil.getRefreshExpiredMs() / 1000)
                .build();

        return new TokenPair(accessToken, refreshCookie);
    }
}
