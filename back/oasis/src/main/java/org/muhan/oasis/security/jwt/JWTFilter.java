package org.muhan.oasis.security.jwt;

import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
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

public class JWTFilter extends OncePerRequestFilter {

    private final JWTUtil jwtUtil;

    // 필터를 무조건 통과시킬 경로 prefix (OAuth2 콜백 등)
    private static final Set<String> SKIP_PREFIXES = Set.of(
            "/api/oauth2/authorization",
            "/api/login/oauth2/code",
            "/swagger-ui",
            "/v3/api-docs",
            "/api/v1/health"
    );

    public JWTFilter(JWTUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain chain) throws ServletException, IOException {

        final String path = request.getRequestURI();

        // 0) OAuth2 플로우/공개 리소스는 필터 스킵
        if (shouldSkip(path)) {
            chain.doFilter(request, response);
            return;
        }

        // 1) Authorization 헤더 없거나 Bearer 아님 → 그냥 통과(익명)
        final String authorization = request.getHeader(HttpHeaders.AUTHORIZATION);
        if (authorization == null || !authorization.startsWith("Bearer ")) {
            chain.doFilter(request, response);
            return;
        }

        // 2) 토큰 추출
        final String token = authorization.substring(7).trim();
        if (token.isEmpty()) {
            chain.doFilter(request, response);
            return;
        }

        try {
            // 3) 만료 검사 (만료면 401)
            if (jwtUtil.isExpired(token)) {
                unauthorized(response, "Access token expired");
                return;
            }

            // 4) 이미 인증이 있으면 스킵 (예: 다른 필터/메커니즘에서 설정됨)
            if (SecurityContextHolder.getContext().getAuthentication() != null) {
                chain.doFilter(request, response);
                return;
            }

            // 5) 클레임 파싱
            String uuid = jwtUtil.getUserUuid(token);
            String profileImg = jwtUtil.getProfileImg(token);
            String nickname = jwtUtil.getNickname(token);
            Role role = jwtUtil.getRole(token);

            // 언어는 널/이상치 안전
            Language lang = safeLanguage(jwtUtil.getLanguage(token));

            // 6) UserDetails 구성
            UserDetailRequestDto dto = new UserDetailRequestDto();
            dto.setUuid(uuid);
            dto.setProfileImg(profileImg);
            dto.setNickname(nickname);
            dto.setRole(role);
            dto.setLanguage(lang);

            CustomUserDetails principal = new CustomUserDetails(UserDetailRequestDto.from(dto));

            Authentication authToken =
                    new UsernamePasswordAuthenticationToken(principal, null, principal.getAuthorities());
            SecurityContextHolder.getContext().setAuthentication(authToken);

            chain.doFilter(request, response);
        } catch (JwtException | IllegalArgumentException e) {
            // 서명 오류, 포맷 오류 등 모든 JWT 파싱 예외는 401
            unauthorized(response, "Invalid access token");
        }
    }

    private boolean shouldSkip(String path) {
        if (path == null) return true; // 방어적
        for (String pre : SKIP_PREFIXES) {
            if (path.startsWith(pre)) return true;
        }
        return false;
    }

    private Language safeLanguage(String lang) {
        if (lang == null || lang.isBlank()) return Language.KOR; // 기본값 프로젝트 규칙에 맞게
        try {
            return Language.valueOf(lang);
        } catch (Exception ignore) {
            return Language.KOR;
        }
    }

    private void unauthorized(HttpServletResponse res, String message) throws IOException {
        res.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        res.setCharacterEncoding(StandardCharsets.UTF_8.name());
        res.setContentType(MediaType.TEXT_PLAIN_VALUE);
        res.getWriter().write(message);
    }
}
