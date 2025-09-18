package org.muhan.oasis.security.Handler;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.apache.logging.log4j.ThreadContext;
import org.muhan.oasis.common.base.BaseResponse;
import org.muhan.oasis.common.base.BaseResponseStatus;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Set;
import java.util.UUID;

@Log4j2
@Component
@RequiredArgsConstructor
public class OAuth2FailureHandler implements AuthenticationFailureHandler {

//    @Value("${app.front-base-url}")
//    private String frontBaseUrl;
    private final String frontBaseUrl = "http://localhost:3000";

    // 리다이렉트로 처리해도 되는 "무해한 재호출/사용자 취소" 유형
    private static final Set<String> BENIGN_ERROR_CODES = Set.of(
            "invalid_state",
            "invalid_request",
            "access_denied"
    );

    @Override
    public void onAuthenticationFailure(HttpServletRequest request,
                                        HttpServletResponse response,
                                        AuthenticationException exception)
            throws IOException {

        final long startNs = System.nanoTime();
        String requestId = firstNonBlank(request.getHeader("X-Request-Id"), UUID.randomUUID().toString());
        bindMdc(request, requestId);

        String errorCode = null;
        if (exception instanceof OAuth2AuthenticationException ex) {
            OAuth2Error err = ex.getError();
            errorCode = (err != null ? err.getErrorCode() : null);
        }

        log.warn("[OAUTH2:FAILURE] >>> start | code={} | type={} | msg={}",
                safe(errorCode), exception.getClass().getSimpleName(), exception.getMessage());

        try {
            boolean wantsJson =
                    acceptsJson(request) ||
                            "XMLHttpRequest".equalsIgnoreCase(request.getHeader("X-Requested-With")) ||
                            "json".equalsIgnoreCase(request.getParameter("responseMode"));

            if (isBenignRepeat(exception, errorCode)) {
                String safeCode = (errorCode != null ? errorCode : "oauth2_repeat");
                String redirect = frontBaseUrl + "/callback?error=" + url(safeCode);

                log.warn("[OAUTH2:FAILURE] benign repeat → {} (JSON? {})", redirect, wantsJson);

                if (!wantsJson) {
                    response.setStatus(HttpServletResponse.SC_FOUND);
                    response.setHeader("Location", redirect);
                    log.info("[OAUTH2:FAILURE] <<< redirect 302 to {}", redirect);
                    return;
                }

                writeJsonError(response, BaseResponseStatus.NO_SIGN_IN, safeCode);
                log.info("[OAUTH2:FAILURE] <<< JSON 401 benign | code={}", safeCode);
                return;
            }

            // 진짜 실패
            log.error("[OAUTH2:FAILURE] non-benign | code={} | detail={}", safe(errorCode), exception.toString());

            if (wantsJson) {
                writeJsonError(response, BaseResponseStatus.NO_SIGN_IN, (errorCode != null ? errorCode : "oauth2_failed"));
                log.info("[OAUTH2:FAILURE] <<< JSON 401 non-benign | code={}", safe(errorCode));
            } else {
                String redirect = frontBaseUrl + "/callback?error=" + url(errorCode != null ? errorCode : "oauth2_failed");
                response.setStatus(HttpServletResponse.SC_FOUND);
                response.setHeader("Location", redirect);
                log.info("[OAUTH2:FAILURE] <<< redirect 302 to {}", redirect);
            }

        } catch (Exception e) {
            log.error("[OAUTH2:FAILURE] handler error: {}", e.getMessage(), e);
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
            new ObjectMapper().writeValue(response.getWriter(),
                    BaseResponse.error(BaseResponseStatus.INTERNAL_SERVER_ERROR));
        } finally {
            long tookMs = (System.nanoTime() - startNs) / 1_000_000;
            log.info("[OAUTH2:FAILURE] done in {} ms", tookMs);
            ThreadContext.clearAll();
        }
    }

    /** 'Accept: application/json' 선호 여부 */
    private boolean acceptsJson(HttpServletRequest request) {
        String accept = request.getHeader(HttpHeaders.ACCEPT);
        return accept != null && accept.contains(MediaType.APPLICATION_JSON_VALUE);
    }

    /** BaseResponse 규격으로 401 JSON 응답 + 헤더 부가정보 */
    private void writeJsonError(HttpServletResponse response, BaseResponseStatus status, String errorCode) throws IOException {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setCharacterEncoding(StandardCharsets.UTF_8.name());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setHeader("X-OAuth2-Error", safe(errorCode));
        new ObjectMapper().writeValue(response.getWriter(), BaseResponse.error(status));
    }

    /** 오직 OAuth2AuthenticationException && 화이트리스트 코드일 때만 true */
    private boolean isBenignRepeat(AuthenticationException ex, String errorCode) {
        if (!(ex instanceof OAuth2AuthenticationException)) return false;
        if (errorCode == null) return false;
        String ec = errorCode.toLowerCase();
        return BENIGN_ERROR_CODES.stream().anyMatch(ec::contains);
    }

    private String url(String s) { return URLEncoder.encode(s, StandardCharsets.UTF_8); }
    private String safe(String s) { return (s == null ? "" : s); }

    private void bindMdc(HttpServletRequest req, String requestId) {
        ThreadContext.put("requestId", requestId);
        ThreadContext.put("method", safe(req.getMethod()));
        ThreadContext.put("path", safe(req.getRequestURI()));
        ThreadContext.put("clientIp", clientIp(req));
        ThreadContext.put("origin", safe(req.getHeader("Origin")));
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

    private String firstNonBlank(String a, String b) {
        return (a != null && !a.isBlank()) ? a : b;
    }
}
