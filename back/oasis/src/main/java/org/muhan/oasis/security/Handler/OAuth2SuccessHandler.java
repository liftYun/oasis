package org.muhan.oasis.security.Handler;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.muhan.oasis.user.entity.UserEntity;
import org.muhan.oasis.security.jwt.CustomOAuth2User;
import org.muhan.oasis.security.jwt.CustomOidcUser;
import org.muhan.oasis.security.jwt.JWTUtil;
import org.muhan.oasis.security.service.JoinService;
import org.muhan.oasis.security.service.RefreshTokenService;
import org.muhan.oasis.valueobject.Language;
import org.muhan.oasis.valueobject.Role;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.client.web.HttpSessionOAuth2AuthorizationRequestRepository;
import org.springframework.security.oauth2.core.endpoint.OAuth2AuthorizationRequest;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class OAuth2SuccessHandler implements AuthenticationSuccessHandler {

    private final JWTUtil jwtUtil;
    private final RefreshTokenService refreshTokenService;
    private final JoinService joinService;

    private final HttpSessionOAuth2AuthorizationRequestRepository authReqRepo =
            new HttpSessionOAuth2AuthorizationRequestRepository();

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {

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

        // ✅ 언어 회수
        OAuth2AuthorizationRequest authReq = authReqRepo.removeAuthorizationRequest(request, response);
        String lang = null;
        if (authReq != null && authReq.getAttributes().get("pref_lang") != null) {
            lang = authReq.getAttributes().get("pref_lang").toString();
        } else if (request.getCookies() != null) {
            for (Cookie c : request.getCookies()) {
                if ("lang".equals(c.getName())) {
                    lang = c.getValue();
                }
            }
        }

        if (lang != null) {
            joinService.updateLanguage(uuid, Language.valueOf(lang));
        }

        // ✅ 기본 Role (처음 가입 시 ROLE_GUEST 부여)
        Role role = user.getRole() != null ? user.getRole() : Role.valueOf("ROLE_GUEST");

        // ✅ Access / Refresh Token 발급
        String accessToken = jwtUtil.createAccessToken(uuid, email, nickname, role);
        String refreshToken = jwtUtil.createRefreshToken(uuid);

        refreshTokenService.saveToken(uuid, refreshToken);

        response.addHeader("Authorization", "Bearer " + accessToken);

        Cookie cookie = new Cookie("refreshToken", refreshToken);
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        cookie.setMaxAge((int)(jwtUtil.getRefreshExpiredMs() / 1000));
        response.addCookie(cookie);

        // ✅ 추가 정보 입력이 필요한 상태라면 프론트에서 별도 요청하도록 안내
        response.setContentType("application/json");
        boolean need = (user.getRole() == null || user.getProfileImg() == null);
        response.getWriter().write("""
        {
          "status": "SUCCESS",
          "needProfileUpdate": %b
        }
        """.formatted(need));
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
