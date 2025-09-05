package org.muhan.oasis.security.Handler;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class OAuth2FailureHandler implements AuthenticationFailureHandler {

    private static final Logger log = LoggerFactory.getLogger(OAuth2FailureHandler.class);

    @Override
    public void onAuthenticationFailure(HttpServletRequest request,
                                        HttpServletResponse response,
                                        AuthenticationException exception) throws IOException {

        String registrationId = request.getParameter("registrationId"); // 없을 수도 있음
        log.warn("OAuth2 login failed. provider={}, message={}",
                registrationId, exception.getMessage());

        // 실패 응답 작성
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType("application/json;charset=UTF-8");

        String body = """
            {
              "status": "FAILURE",
              "error": "%s",
              "message": "%s"
            }
            """.formatted(exception.getClass().getSimpleName(),
                exception.getMessage());

        response.getWriter().write(body);
    }
}
