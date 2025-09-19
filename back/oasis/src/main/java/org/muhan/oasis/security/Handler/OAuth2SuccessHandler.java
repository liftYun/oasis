package org.muhan.oasis.security.Handler;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.muhan.oasis.common.base.BaseResponse;
import org.muhan.oasis.security.jwt.CustomOAuth2User;
import org.muhan.oasis.security.jwt.CustomOidcUser;
import org.muhan.oasis.security.jwt.JWTUtil;
import org.muhan.oasis.security.service.JoinService;
import org.muhan.oasis.security.service.RefreshTokenService;
import org.muhan.oasis.user.entity.UserEntity;
import org.muhan.oasis.valueobject.Language;
import org.muhan.oasis.valueobject.Role;
import org.slf4j.MDC;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.net.URI;
import java.time.Duration;
import java.util.Map;
import java.util.UUID;

@Component
@Slf4j
@RequiredArgsConstructor
public class OAuth2SuccessHandler implements AuthenticationSuccessHandler {

//    @Value("${app.front-base-url}")
//    private String frontBaseUrl;
    private final String frontBaseUrl = "http://localhost:3000";
    @Value("${app.domain}")
    private String cookieDomain;

    private final JWTUtil jwtUtil;
    private final RefreshTokenService refreshTokenService;
    private final JoinService joinService;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException {

        final long startNs = System.nanoTime();
        String requestId = firstNonBlank(request.getHeader("X-Request-Id"), UUID.randomUUID().toString());
        bindMdc(request, requestId);
        log.info("[OAUTH2:SUCCESS] >>> start | clientIp={}, regId={}",
                clientIp(request),
                (authentication instanceof OAuth2AuthenticationToken t ? t.getAuthorizedClientRegistrationId() : "N/A"));

        try {
            OAuth2AuthenticationToken token = (OAuth2AuthenticationToken) authentication;
            Object principalObj = token.getPrincipal();

            // === 사용자 식별/등록 ===
            UserEntity user;
            if (principalObj instanceof CustomOAuth2User p) {
                user = p.getUser();
                log.debug("[OAUTH2:SUCCESS] principal=CustomOAuth2User, provider={}", token.getAuthorizedClientRegistrationId());

            } else if (principalObj instanceof CustomOidcUser p) {
                user = p.getUser();
                log.debug("[OAUTH2:SUCCESS] principal=CustomOidcUser, provider={}", token.getAuthorizedClientRegistrationId());

            } else if (principalObj instanceof OidcUser oidc) {
                Map<String, Object> attrs = oidc.getAttributes();
                String email = stringOrNull(attrs.get("email"));
                String nickname = firstNonBlank(
                        stringOrNull(attrs.get("name")),
                        stringOrNull(attrs.get("given_name")),
                        email
                );
                String profileUrl = stringOrNull(attrs.get("profile_url"));
                user = joinService.registerSocialUserIfNotExist(email, nickname, profileUrl, null);
                log.info("[OAUTH2:SUCCESS] fallback OIDC user registeredOrLoaded | email={}", safe(email));

            } else if (principalObj instanceof OAuth2User oauth) {
                Map<String, Object> attrs = oauth.getAttributes();
                String email = stringOrNull(attrs.get("email"));
                String nickname = firstNonBlank(
                        stringOrNull(attrs.get("name")),
                        stringOrNull(attrs.get("nickname")),
                        stringOrNull(attrs.get("login")),
                        email
                );
                String profileUrl = stringOrNull(attrs.get("profile_url"));
                user = joinService.registerSocialUserIfNotExist(email, nickname, profileUrl, null);
                log.info("[OAUTH2:SUCCESS] fallback OAuth2 user registeredOrLoaded | email={}", safe(email));

            } else {
                log.error("[OAUTH2:SUCCESS] Unexpected principal type: {}", principalObj.getClass());
                throw new IllegalStateException("Unexpected principal type: " + principalObj.getClass());
            }

            // === 토큰/쿠키 세팅 ===
            String uuid = user.getUserUuid();
            String email = user.getEmail();
            String nickname = user.getNickname();

            Role role = (user.getRole() != null ? user.getRole() : Role.valueOf("ROLE_GUEST"));
            Language language = (user.getLanguage() != null ? user.getLanguage() : Language.KOR);

            // AccessToken은 프런트 플로우에 따라 발급 시점 조절 (현재 미사용)
            // String accessToken = jwtUtil.createAccessToken(uuid, email, nickname, role, language);

            String refreshToken = jwtUtil.createRefreshToken(uuid);
            refreshTokenService.saveToken(uuid, refreshToken);
            log.info("[OAUTH2:SUCCESS] tokens issued | uuid={}, role={}, lang={}, rtTtlMs={}",
                    uuid, role, language, jwtUtil.getRefreshExpiredMs());

            // 요청 기반 프론트 베이스 URL 동적 결정
            log.info("[OAUTH2:SUCCESS] frontBaseUrl={}", frontBaseUrl);
            boolean isLocal = isLocalOrigin(frontBaseUrl);
            boolean secure = !isLocal && isHttps(frontBaseUrl, request);

            String rtCookie = ResponseCookie.from("refreshToken", refreshToken)
                    .httpOnly(true)
                    .secure(true)              // 로컬 HTTP 개발이면 false로
                    .sameSite("None")
                    .domain(cookieDomain)
                    .path("/")
                    .maxAge(Duration.ofMillis(jwtUtil.getRefreshExpiredMs()))
                    .build().toString();
            response.addHeader(HttpHeaders.SET_COOKIE, rtCookie);
            log.debug("[OAUTH2:SUCCESS] refreshToken cookie set | domain={}, path=/, sameSite=None, secure=true", cookieDomain);

            // OAuth2 요청 쿠키 정리 (클라이언트/서버 저장소 모두 운용 시 충돌 방지)
            ResponseCookie deleteCookie = ResponseCookie.from("OAUTH2_AUTH_REQUEST", "")
                    .httpOnly(true)
                    .secure(true)
                    .sameSite("None")
                    .domain(cookieDomain)
                    .path("/")
                    .maxAge(0)
                    .build();
            response.addHeader(HttpHeaders.SET_COOKIE, deleteCookie.toString());
            log.debug("[OAUTH2:SUCCESS] cleanup cookie issued: OAUTH2_AUTH_REQUEST");

            boolean needProfileUpdate = (user.getRole() == null || user.getProfileUrl() == null);
            String baseRedirect = frontBaseUrl + "/register/callback";
            log.info("[OAUTH2:SUCCESS] user ready | uuid={}, email={}, needProfileUpdate={}, next={}",
                    uuid, safe(email), needProfileUpdate, baseRedirect);

            boolean wantsJson =
                    acceptsJson(request) ||
                            "XMLHttpRequest".equalsIgnoreCase(request.getHeader("X-Requested-With")) ||
                            "json".equalsIgnoreCase(request.getParameter("responseMode"));

            response.setHeader("Cache-Control", "no-store");
            response.setHeader("Pragma", "no-cache");

            if (!wantsJson) {
                String redirectUrl = baseRedirect + (baseRedirect.contains("?") ? "&" : "?")
                        + "needProfileUpdate=" + needProfileUpdate;
                response.setStatus(HttpServletResponse.SC_FOUND);
                response.setHeader("Location", redirectUrl);
                log.info("[OAUTH2:SUCCESS] <<< redirect 302 to {}", redirectUrl);
                return;
            }

            // JSON 모드
            response.setContentType(MediaType.APPLICATION_JSON_VALUE + "; charset=UTF-8");
            new ObjectMapper().writeValue(
                    response.getWriter(),
                    BaseResponse.of(
                            Map.of(
                                    "needProfileUpdate", needProfileUpdate,
                                    "nextUrl", baseRedirect
                            )
                    )
            );
            log.info("[OAUTH2:SUCCESS] <<< JSON 200 | nextUrl={}", baseRedirect);

        } catch (Exception e) {
            log.error("[OAUTH2:SUCCESS] handler error: {}", e.getMessage(), e);
            // 실패 시, 프론트가 기대하는 방식으로 최소한의 안내 (여기선 500 JSON)
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
            new ObjectMapper().writeValue(response.getWriter(),
                    Map.of("status", 500, "message", "OAuth2 success handler failed"));
        } finally {
            long tookMs = (System.nanoTime() - startNs) / 1_000_000;
            log.info("[OAUTH2:SUCCESS] done in {} ms", tookMs);
            MDC.clear();
        }
    }

    private boolean isHttps(String frontBaseUrl, HttpServletRequest request) {
        try {
            if (frontBaseUrl != null) {
                URI u = URI.create(frontBaseUrl);
                if (u.getScheme() != null) return "https".equalsIgnoreCase(u.getScheme());
            }
        } catch (Exception ignored) {}
        // 프록시 헤더 고려
        String proto = request.getHeader("X-Forwarded-Proto");
        if (proto != null) return "https".equalsIgnoreCase(proto);
        return request.isSecure();
    }

    private boolean isLocalOrigin(String url) {
        try {
            URI u = URI.create(url);
            String host = u.getHost();
            return host != null && ("localhost".equalsIgnoreCase(host) || host.startsWith("127."));
        } catch (Exception e) {
            return false;
        }
    }

    private boolean acceptsJson(HttpServletRequest request) {
        String accept = request.getHeader(HttpHeaders.ACCEPT);
        return accept != null && accept.contains(MediaType.APPLICATION_JSON_VALUE);
    }

    private static String stringOrNull(Object o) {
        return (o == null ? null : String.valueOf(o));
    }

    private static String firstNonBlank(String... vals) {
        for (String v : vals) if (v != null && !v.isBlank()) return v;
        return null;
    }

    private String safe(String s) { return (s == null ? "" : s); }

    private void bindMdc(HttpServletRequest req, String requestId) {
        MDC.put("requestId", requestId);
        MDC.put("method", safe(req.getMethod()));
        MDC.put("path", safe(req.getRequestURI()));
        MDC.put("clientIp", clientIp(req));
        MDC.put("origin", safe(req.getHeader("Origin")));
    }

    private String clientIp(HttpServletRequest req) {
        String[] headers = {"X-Forwarded-For","X-Real-IP","CF-Connecting-IP","X-Client-IP"};
        for (String h : headers) {
            String v = req.getHeader(h);
            if (v != null && !v.isBlank()) {
                int comma = v.indexOf(',');
                return comma > 0 ? v.substring(0, comma).trim() : v.trim();
            }
        }
        return req.getRemoteAddr();
    }
}
