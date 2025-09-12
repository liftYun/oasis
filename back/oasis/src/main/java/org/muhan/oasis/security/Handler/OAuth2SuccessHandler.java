package org.muhan.oasis.security.Handler;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.muhan.oasis.common.base.BaseResponse;
import org.muhan.oasis.user.entity.UserEntity;
import org.muhan.oasis.security.jwt.CustomOAuth2User;
import org.muhan.oasis.security.jwt.CustomOidcUser;
import org.muhan.oasis.security.jwt.JWTUtil;
import org.muhan.oasis.security.service.JoinService;
import org.muhan.oasis.security.service.RefreshTokenService;
import org.muhan.oasis.valueobject.Language;
import org.muhan.oasis.valueobject.Role;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.client.web.HttpSessionOAuth2AuthorizationRequestRepository;
import org.springframework.security.oauth2.core.endpoint.OAuth2AuthorizationRequest;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class OAuth2SuccessHandler implements AuthenticationSuccessHandler {

    @Value("${app.front-base-url}")
    private String frontBaseUrl;

    private final JWTUtil jwtUtil;
    private final RefreshTokenService refreshTokenService;
    private final JoinService joinService;

    private final HttpSessionOAuth2AuthorizationRequestRepository authReqRepo =
            new HttpSessionOAuth2AuthorizationRequestRepository();

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException {

        OAuth2AuthenticationToken token = (OAuth2AuthenticationToken) authentication;
        Object principalObj = token.getPrincipal();

        UserEntity user;
        if (principalObj instanceof CustomOAuth2User p) {
            // 카카오/네이버 등 기존 커스텀 OAuth2
            user = p.getUser();

        } else if (principalObj instanceof CustomOidcUser p) {
            // 구글(OIDC) — oidcUserService에서 감싼 커스텀 OIDC
            user = p.getUser();

        } else if (principalObj instanceof OidcUser oidc) {
            // (안전망) 만약 커스텀 OIDC가 아닌 DefaultOidcUser가 들어온 경우
            Map<String, Object> attrs = oidc.getAttributes();
            String email = stringOrNull(attrs.get("email"));
            String nickname = firstNonBlank(
                    stringOrNull(attrs.get("name")),
                    stringOrNull(attrs.get("given_name")),
                    email
            );
            user = joinService.registerSocialUserIfNotExist(email, nickname, null);

        } else if (principalObj instanceof OAuth2User oauth) {
            // (안전망) 일반 OAuth2 — 커스텀 래핑이 안 된 경우
            Map<String, Object> attrs = oauth.getAttributes();
            String email = stringOrNull(attrs.get("email"));
            String nickname = firstNonBlank(
                    stringOrNull(attrs.get("name")),
                    stringOrNull(attrs.get("nickname")),
                    stringOrNull(attrs.get("login")),
                    email
            );
            user = joinService.registerSocialUserIfNotExist(email, nickname, null);

        } else {
            throw new IllegalStateException("Unexpected principal type: " + principalObj.getClass());
        }
        String uuid = user.getUserUuid();
        String email = user.getEmail();
        String nickname = user.getNickname();

        // ✅ 기본 Role (처음 가입 시 ROLE_GUEST 부여)
        Role role = user.getRole() != null ? user.getRole() : Role.valueOf("ROLE_GUEST");

        Language language = user.getLanguage() != null ? user.getLanguage() : Language.valueOf("KOR");

        // ✅ Access / Refresh Token 발급
        String accessToken = jwtUtil.createAccessToken(uuid, email, nickname, role, language);
        String refreshToken = jwtUtil.createRefreshToken(uuid);

        refreshTokenService.saveToken(uuid, refreshToken);

        response.addHeader("Authorization", "Bearer " + accessToken);

//        Cookie cookie = new Cookie("refreshToken", refreshToken);
//        cookie.setHttpOnly(true);
//        cookie.setPath("/");
//        cookie.setMaxAge((int)(jwtUtil.getRefreshExpiredMs() / 1000));
//        response.addCookie(cookie);
        String cookie = ResponseCookie.from("refreshToken", refreshToken)
                .httpOnly(true)
                .secure(true)           // 로컬 HTTP 개발 시 false, 배포는 true
                .sameSite("None")       // SPA 도메인 분리 시 필수
                .path("/")
                .maxAge(Duration.ofMillis(jwtUtil.getRefreshExpiredMs()))
                .build().toString();
        response.addHeader(HttpHeaders.SET_COOKIE, cookie);

        boolean needProfileUpdate = (user.getRole() == null || user.getProfileUrl() == null);
        String baseRedirect = needProfileUpdate ? frontBaseUrl + "/register/callback"
                : frontBaseUrl + "/";

//        String encodedEmail = URLEncoder.encode(email != null ? email : "", StandardCharsets.UTF_8);
//        String redirectUrl = baseRedirect + (baseRedirect.contains("?") ? "&" : "?") + "email=" + encodedEmail;
//
//        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
//
//        new ObjectMapper().writeValue(
//                response.getWriter(),
//                BaseResponse.of(
//                        Map.of(
//                                "needProfileUpdate", needProfileUpdate,
//                                "redirectUrl", redirectUrl
//                        )
//                )
//        );
        String accept = request.getHeader("Accept");
        boolean wantsJson =
                (accept != null && accept.contains(MediaType.APPLICATION_JSON_VALUE))
                        || "XMLHttpRequest".equalsIgnoreCase(request.getHeader("X-Requested-With"))
                        || "json".equalsIgnoreCase(request.getParameter("responseMode"));

        if (!wantsJson) {
            String redirectUrl = baseRedirect
                    + "?accessToken=" + URLEncoder.encode(accessToken, StandardCharsets.UTF_8)
                    + "&needProfileUpdate=" + needProfileUpdate;

            response.setHeader("Cache-Control", "no-store");
            response.setHeader("Pragma", "no-cache");
            response.setStatus(HttpServletResponse.SC_FOUND);
            response.setHeader("Location", redirectUrl);
            return;
        }

        // JSON 모드: BaseResponse로 내려주고, 프론트가 nextUrl로 이동
        response.setContentType(MediaType.APPLICATION_JSON_VALUE + "; charset=UTF-8");
        new ObjectMapper().writeValue(
                response.getWriter(),
                BaseResponse.of(
                        Map.of(
                                "needProfileUpdate", needProfileUpdate,
                                // 의미를 명확히: 클라이언트가 사용할 URL
                                "nextUrl", baseRedirect
                        )
                )
        );
    }

    private static String stringOrNull(Object o) {
        return o == null ? null : String.valueOf(o);
    }

    @SafeVarargs
    private static String firstNonBlank(String... vals) {
        for (String v : vals) {
            if (v != null && !v.isBlank()) return v;
        }
        return null;
    }
}
