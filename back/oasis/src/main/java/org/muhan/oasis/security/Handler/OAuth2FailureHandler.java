package org.muhan.oasis.security.Handler;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
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

@Log4j2
@Component
@RequiredArgsConstructor
public class OAuth2FailureHandler implements AuthenticationFailureHandler {

    @Value("${app.front-base-url}")
    private String frontBaseUrl;

    // 리다이렉트로 처리해도 되는 "무해한 재호출/사용자 취소" 유형
    private static final Set<String> BENIGN_ERROR_CODES = Set.of(
            "invalid_state",      // state 소모 후 재호출
            "invalid_request",    // 파라미터 불일치 등
            "access_denied"       // 사용자가 동의 거절
    );

    @Override
    public void onAuthenticationFailure(HttpServletRequest request,
                                        HttpServletResponse response,
                                        AuthenticationException exception)
            throws IOException, ServletException {

        String errorCode = null;
        if (exception instanceof OAuth2AuthenticationException ex) {
            OAuth2Error err = ex.getError();
            errorCode = (err != null ? err.getErrorCode() : null);
        }

        // 프론트가 JSON을 원하면 JSON으로, 아니면 리다이렉트
        boolean wantsJson =
                acceptsJson(request) ||
                        "XMLHttpRequest".equalsIgnoreCase(request.getHeader("X-Requested-With")) ||
                        "json".equalsIgnoreCase(request.getParameter("responseMode"));

        // 1) benign repeat만 프론트 콜백으로 리다이렉트 (XHR일 땐 JSON로)
        if (isBenignRepeat(exception, errorCode)) {
            String safeCode = (errorCode != null ? errorCode : "oauth2_repeat");
            String redirect = frontBaseUrl + "/callback?error=" + url(safeCode);

            log.warn("[OAuth2Failure] benign repeat/invalid state. code={}, redirect={}", errorCode, redirect);

            if (!wantsJson) {
                response.setStatus(HttpServletResponse.SC_FOUND);
                response.setHeader("Location", redirect);
                return;
            }

            // JSON 모드: 프로젝트 표준 BaseResponse로 응답 (401)
            writeJsonError(response, BaseResponseStatus.NO_SIGN_IN, safeCode);
            return;
        }

        // 2) 그 외(진짜 실패)는 일관된 JSON 에러(401) 또는 프론트 콜백으로 리다이렉트
        log.error("[OAuth2Failure] non-benign failure. code={}, ex={}", errorCode, exception.toString());

        if (wantsJson) {
            writeJsonError(response, BaseResponseStatus.NO_SIGN_IN, (errorCode != null ? errorCode : "oauth2_failed"));
        } else {
            String redirect = frontBaseUrl + "/callback?error=" + url(errorCode != null ? errorCode : "oauth2_failed");
            response.setStatus(HttpServletResponse.SC_FOUND);
            response.setHeader("Location", redirect);
        }
    }

    /** 'Accept: application/json' 선호 여부 */
    private boolean acceptsJson(HttpServletRequest request) {
        String accept = request.getHeader(HttpHeaders.ACCEPT);
        return accept != null && accept.contains(MediaType.APPLICATION_JSON_VALUE);
    }

    /** BaseResponse 규격으로 401 JSON 응답 */
    private void writeJsonError(HttpServletResponse response, BaseResponseStatus status, String errorCode) throws IOException {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setCharacterEncoding(StandardCharsets.UTF_8.name());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);

        // 필요 시 에러 코드를 payload에 추가하고 싶다면, 메시지 필드만으로도 충분하지만
        // 다음과 같이 확장해도 됩니다: BaseResponse.of(Map.of("error", errorCode))
        new ObjectMapper().writeValue(response.getWriter(), BaseResponse.error(status));
        // 헤더에 상세한 에러 코드를 싣고 싶다면:
        response.setHeader("X-OAuth2-Error", errorCode);
    }

    /** 오직 OAuth2AuthenticationException && 화이트리스트 코드일 때만 true */
    private boolean isBenignRepeat(AuthenticationException ex, String errorCode) {
        if (!(ex instanceof OAuth2AuthenticationException)) return false;
        if (errorCode == null) return false;
        String ec = errorCode.toLowerCase();
        return BENIGN_ERROR_CODES.stream().anyMatch(ec::contains);
    }

    private String url(String s) {
        return URLEncoder.encode(s, StandardCharsets.UTF_8);
    }
}
