package org.muhan.oasis.security.jwt;

import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.log4j.Log4j2;
import org.apache.logging.log4j.ThreadContext;
import org.muhan.oasis.security.dto.in.UserDetailRequestDto;
import org.muhan.oasis.security.dto.out.CustomUserDetails;
import org.muhan.oasis.valueobject.Language;
import org.muhan.oasis.valueobject.Role;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Set;
import java.util.UUID;

@Log4j2
public class JWTFilter extends OncePerRequestFilter {

    private final JWTUtil jwtUtil;

    // 필터를 무조건 통과시킬 경로 prefix (OAuth2 콜백 등)
    private static final Set<String> SKIP_PREFIXES = Set.of(
            "/api/oauth2/authorization",
            "/api/login/oauth2/code",
            "/api/v1/auth/refresh",
            "/api/v1/auth/issue",
            "/swagger-ui",
            "/v3/api-docs",
            "/api/v1/health",
            "/error"
    );

    public JWTFilter(JWTUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String method = request.getMethod();
        if ("OPTIONS".equalsIgnoreCase(method)) {
            return true;
        }
        String path = request.getRequestURI();
        if (path == null) return true;
        for (String pre : SKIP_PREFIXES) {
            if (path.startsWith(pre)) return true;
        }
        return false;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain chain) throws ServletException, IOException {

        long startNs = System.nanoTime();
        String requestId = firstNonBlank(request.getHeader("X-Request-Id"), UUID.randomUUID().toString());
        String method = safe(request.getMethod());
        String path = safe(request.getRequestURI());
        String origin = safe(request.getHeader("Origin"));
        String clientIp = clientIp(request);

        // ==== MDC (ThreadContext) 바인딩 ====
        ThreadContext.put("requestId", requestId);
        ThreadContext.put("method", method);
        ThreadContext.put("path", path);
        ThreadContext.put("clientIp", clientIp);
        ThreadContext.put("origin", origin);

        log.info("[JWT] >>> Incoming request: {} {} | origin={} | ip={}", method, path, origin, clientIp);

        try {
            // 프리플라이트/스킵 경로
            if (shouldSkip(path)) {
                log.debug("[JWT] Skipped by path/method. path={}, method={}", path, method);
                chain.doFilter(request, response);
                return;
            }

            final String authorization = request.getHeader(HttpHeaders.AUTHORIZATION);

            if (authorization == null) {
                log.debug("[JWT] No Authorization header. Proceed as anonymous.");
                chain.doFilter(request, response);
                return;
            }
            if (!authorization.startsWith("Bearer ")) {
                log.warn("[JWT] Authorization header present but not Bearer. valuePrefix={}", authorization.length() >= 6 ? authorization.substring(0, 6) : authorization);
                chain.doFilter(request, response);
                return;
            }

            final String token = authorization.substring(7).trim();
            if (token.isEmpty()) {
                log.warn("[JWT] Bearer token is empty");
                chain.doFilter(request, response);
                return;
            }

            // 만료 검사
            try {
                if (jwtUtil.isExpired(token)) {
                    log.info("[JWT] Access token expired");
                    unauthorized(response, "Access token expired");
                    return;
                }
            } catch (JwtException ex) {
                // isExpired 과정에서 서명/포맷 오류가 날 수도 있으므로 분리
                log.warn("[JWT] Token validation error during expiration check: {}", ex.getMessage());
                unauthorized(response, "Invalid access token");
                return;
            }

            // 이미 인증 객체가 있으면 통과
            if (SecurityContextHolder.getContext().getAuthentication() != null) {
                Authentication existing = SecurityContextHolder.getContext().getAuthentication();
                log.debug("[JWT] Authentication already present. principalClass={}", existing.getPrincipal().getClass().getSimpleName());
                chain.doFilter(request, response);
                return;
            }

            // 최소 클레임만 파싱(민감정보 로그 금지)
            String uuid = null;
            Role role = null;
            String nickname = null;
            String profileImg = null;
            Language lang;

            try {
                uuid = safe(jwtUtil.getUserUuid(token));
                nickname = safe(jwtUtil.getNickname(token));
                profileImg = safe(jwtUtil.getProfileImg(token));
                role = jwtUtil.getRole(token);
                lang = safeLanguage(jwtUtil.getLanguage(token));
            } catch (JwtException | IllegalArgumentException e) {
                log.warn("[JWT] Token parsing error: {}", e.getMessage());
                unauthorized(response, "Invalid access token");
                return;
            }

            // UserDetails 구성 및 SecurityContext 세팅
            UserDetailRequestDto dto = new UserDetailRequestDto();
            dto.setUuid(uuid);
            dto.setProfileImg(profileImg);
            dto.setNickname(nickname);
            dto.setRole(role);
            dto.setLanguage(lang);

            CustomUserDetails principal = new CustomUserDetails(UserDetailRequestDto.from(dto));
            Authentication authToken = new UsernamePasswordAuthenticationToken(principal, null, principal.getAuthorities());
            SecurityContextHolder.getContext().setAuthentication(authToken);

            log.info("[JWT] Authentication set. userUuid={}, role={}, lang={}", uuid, role, lang);

            chain.doFilter(request, response);

        } catch (JwtException | IllegalArgumentException e) {
            log.error("[JWT] Unexpected JWT error: {}", e.getMessage(), e);
            unauthorized(response, "Invalid access token");
        } catch (Exception e) {
            log.error("[JWT] Unexpected error in filter: {}", e.getMessage(), e);
            throw e;
        } finally {
            long tookMs = (System.nanoTime() - startNs) / 1_000_000;
            log.info("[JWT] <<< Completed {} {} in {} ms", method, path, tookMs);
            ThreadContext.clearAll(); // MDC 정리
        }
    }

    private boolean shouldSkip(String path) {
        if (path == null) return true;
        for (String pre : SKIP_PREFIXES) {
            if (path.startsWith(pre)) return true;
        }
        return false;
    }

    private Language safeLanguage(String lang) {
        if (lang == null || lang.isBlank()) return Language.KOR;
        try {
            return Language.valueOf(lang);
        } catch (Exception ignore) {
            return Language.KOR;
        }
    }

    private void unauthorized(HttpServletResponse res, String message) throws IOException {
        // 로그는 위에서 기록됨. 여기서는 응답만.
        res.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        res.setCharacterEncoding(StandardCharsets.UTF_8.name());
        res.setContentType(MediaType.APPLICATION_JSON_VALUE);
        // 응답 본문은 간결하게 — 클라이언트가 파싱하는 기본 포맷 유지
        String body = "{\"status\":401,\"code\":\"" + message + "\",\"message\":\"Unauthorized\"}";
        res.getWriter().write(body);
        log.info("[JWT] Responded 401: {}", message);
    }

    private String clientIp(HttpServletRequest req) {
        String[] headers = {
                "X-Forwarded-For",
                "X-Real-IP",
                "CF-Connecting-IP",
                "X-Client-IP"
        };
        for (String h : headers) {
            String v = req.getHeader(h);
            if (v != null && !v.isBlank()) {
                // XFF는 다중 IP일 수 있으니 첫 번째만
                int comma = v.indexOf(',');
                return comma > 0 ? v.substring(0, comma).trim() : v.trim();
            }
        }
        return req.getRemoteAddr();
    }

    private String firstNonBlank(String a, String b) {
        return (a != null && !a.isBlank()) ? a : b;
    }

    private String safe(String s) {
        return s == null ? "" : s;
    }
}
