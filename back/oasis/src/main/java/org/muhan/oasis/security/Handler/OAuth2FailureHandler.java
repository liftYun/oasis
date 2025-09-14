package org.muhan.oasis.security.Handler;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Log4j2
@Component
@RequiredArgsConstructor
public class OAuth2FailureHandler implements AuthenticationFailureHandler {

    @Value("${app.front-base-url}")
    private String frontBaseUrl;

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

        // ✅ 흔한 잔여 콜백 케이스들: state 불일치/없음/invalid_request 등은 401 대신 프론트로 리다이렉트
        if (isBenignRepeat(errorCode)) {
            String redirect = frontBaseUrl + "/login?error="
                    + URLEncoder.encode(errorCode != null ? errorCode : "oauth2_repeat", StandardCharsets.UTF_8);
            log.warn("[OAuth2Failure] benign repeat/invalid state. Redirect -> {}", redirect);
            response.setStatus(HttpServletResponse.SC_FOUND);
            response.setHeader("Location", redirect);
            return;
        }

        // 그 외는 기존처럼 401
        log.error("[OAuth2Failure] code={}, ex={}", errorCode, exception.toString());
        response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "OAuth2 login failed");
    }

    private boolean isBenignRepeat(String errorCode) {
        if (errorCode == null) return true;
        String ec = errorCode.toLowerCase();
        return ec.contains("invalid_state") || ec.contains("invalid_request") || ec.contains("access_denied");
    }
}
