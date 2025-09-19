package org.muhan.oasis.security.Handler;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import java.net.URI;
import java.util.Arrays;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class FrontUrlResolver {

    /** 예: ".stay-oasis.kr"  (서브도메인 신뢰 경계) */
    @Value("${app.domain}")
    private String appDomain;

    /** 기본 폴백 프론트 URL */
    @Value("${app.front-base-url}")
    private String frontBaseUrl;

    /** 선택: 외부(사내 도메인 외) 허용 오리진 화이트리스트. 비어있으면 사용 안 함. */
    @Value("${app.front.allowed-origins:}")
    private String allowedOriginsRaw;

    private List<String> allowedOrigins() {
        if (!StringUtils.hasText(allowedOriginsRaw)) return List.of();
        return Arrays.stream(allowedOriginsRaw.split(","))
                .map(String::trim)
                .filter(StringUtils::hasText)
                .toList();
    }

    public String resolve(HttpServletRequest request) {
        // 1) Origin 우선
        String origin = request.getHeader("Origin");
        String resolved = resolveByOrigin(origin);
        if (resolved != null) return resolved;

        // 2) Referer에서 origin 추출
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
            String scheme = uri.getScheme();
            String host = uri.getHost();
            int port = uri.getPort();

            if (!StringUtils.hasText(scheme) || !StringUtils.hasText(host)) return null;

            // localhost/127.* 은 개발 편의상 그대로 허용
            if ("localhost".equalsIgnoreCase(host) || host.startsWith("127.")) {
                return normalizeOrigin(scheme, host, port);
            }

            // 사내 도메인(예: *.stay-oasis.kr)이라면 들어온 호스트 그대로 반환 → 환경(dev/stg/prod) 존중
            if (StringUtils.hasText(appDomain) && host.endsWith(appDomain)) {
                // 보안상 비로컬은 https만 허용하고 싶다면 여기에서 강제 가능 (원하면 아래 주석 해제)
                // scheme = "https";
                return normalizeOrigin(scheme, host, port);
            }

            // 선택: 사내 도메인 외라도 화이트리스트에 있으면 허용
            if (allowedOrigins().stream().anyMatch(origin::equalsIgnoreCase)) {
                return origin;
            }

            // 나머지는 안전하게 기본 프론트로 폴백
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
            return normalizeOrigin(scheme, host, port);
        } catch (Exception e) {
            return null;
        }
    }

    private String normalizeOrigin(String scheme, String host, int port) {
        if (port <= 0) return scheme + "://" + host;
        return scheme + "://" + host + ":" + port;
    }
}
