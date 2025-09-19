package org.muhan.oasis.security.Handler;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import java.net.URI;

@Slf4j
@Component
@RequiredArgsConstructor
public class FrontUrlResolver {

    @Value("${app.domain}")
    private String appDomain; // 예: ".stay-oasis.kr"

    @Value("${app.front-base-url}")
    private String frontBaseUrl; // 예: "https://dev.stay-oasis.kr"

    public String resolve(HttpServletRequest request) {
        // 1) Origin 우선
        String origin = request.getHeader("Origin");
        String resolved = resolveByOrigin(origin);
        if (resolved != null) return resolved;

        // 2) Referer 대신 사용
        String referer = request.getHeader("Referer");
        resolved = resolveByOrigin(extractOrigin(referer));
        if (resolved != null) return resolved;

        // 3) 기본값
        return frontBaseUrl;
    }

    private String resolveByOrigin(String origin) {
        if (!StringUtils.hasText(origin)) return null;
        try {
            URI uri = URI.create(origin);
            String host = uri.getHost();
            if (!StringUtils.hasText(host)) return null;

            // localhost/127.x.x.x → 들어온 origin 그대로 사용
            if ("localhost".equalsIgnoreCase(host) || host.startsWith("127.")) {
                return origin;
            }

            // 사내/배포 도메인 계열이면 무조건 frontBaseUrl로 통일
            if (StringUtils.hasText(appDomain) && host.endsWith(appDomain)) {
                return frontBaseUrl;
            }

            // 기타는 모두 기본값
            return frontBaseUrl;
        } catch (Exception e) {
            log.debug("Failed to parse origin: {}", origin, e);
            return null;
        }
    }

    private String extractOrigin(String referer) {
        try {
            if (!StringUtils.hasText(referer)) return null;
            URI uri = URI.create(referer);
            String scheme = uri.getScheme();
            String host = uri.getHost();
            int port = uri.getPort();
            if (!StringUtils.hasText(scheme) || !StringUtils.hasText(host)) return null;
            return (port == -1) ? scheme + "://" + host : scheme + "://" + host + ":" + port;
        } catch (Exception e) {
            return null;
        }
    }
}