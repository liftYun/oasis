package org.muhan.oasis.security.jwt;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.security.oauth2.client.web.DefaultOAuth2AuthorizationRequestResolver;
import org.springframework.security.oauth2.client.web.OAuth2AuthorizationRequestResolver;
import org.springframework.security.oauth2.core.endpoint.OAuth2AuthorizationRequest;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Component
public class LangAwareAuthorizationRequestResolver implements OAuth2AuthorizationRequestResolver {
    private final DefaultOAuth2AuthorizationRequestResolver delegate;

    public LangAwareAuthorizationRequestResolver(ClientRegistrationRepository repo) {
        this.delegate = new DefaultOAuth2AuthorizationRequestResolver(repo, "/oauth2/authorization");
    }

    @Override
    public OAuth2AuthorizationRequest resolve(HttpServletRequest request) {
        OAuth2AuthorizationRequest req = delegate.resolve(request);
        return customize(request, req);
    }

    @Override
    public OAuth2AuthorizationRequest resolve(HttpServletRequest request, String registrationId) {
        OAuth2AuthorizationRequest req = delegate.resolve(request, registrationId);
        return customize(request, req);
    }

    private OAuth2AuthorizationRequest customize(HttpServletRequest request, OAuth2AuthorizationRequest req) {
        if (req == null) return null;

        // 1) URL 파라미터나 2) 쿠키에서 lang 읽기
        String lang = request.getParameter("lang");
        if (lang == null) {
            lang = Arrays.stream(Optional.ofNullable(request.getCookies()).orElse(new Cookie[0]))
                    .filter(c -> "lang".equals(c.getName()))
                    .map(Cookie::getValue)
                    .findFirst().orElse(null);
        }

        if (lang == null) return req;

        // 세션에 보관될 AuthorizationRequest에 언어 저장
        Map<String, Object> attrs = new HashMap<>(req.getAttributes());
        attrs.put("pref_lang", lang);

        Map<String, Object> addl = new HashMap<>(req.getAdditionalParameters());
        addl.put("pref_lang", lang); // 필요시

        return OAuth2AuthorizationRequest.from(req)
                .attributes(attrs)
                .additionalParameters(addl)
                .build();
    }
}

