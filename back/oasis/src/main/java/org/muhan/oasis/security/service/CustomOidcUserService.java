package org.muhan.oasis.security.service;

import lombok.RequiredArgsConstructor;
import org.muhan.oasis.security.entity.UserEntity;
import org.muhan.oasis.security.jwt.CustomOidcUser;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserRequest;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.oidc.OidcUserInfo;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.security.oauth2.core.oidc.OidcIdToken;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.Map;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class CustomOidcUserService implements OAuth2UserService<OidcUserRequest, OidcUser> {

    private final JoinService joinService;

    @Override
    public OidcUser loadUser(OidcUserRequest userRequest) throws OAuth2AuthenticationException {
        // 표준 OIDC 유저 로드
        OidcUserService delegate = new OidcUserService();
        OidcUser oidcUser = delegate.loadUser(userRequest);

        // 클레임/속성
        Map<String, Object> claims = oidcUser.getClaims();
        String email = stringOrNull(claims.get("email"));
        String name  = firstNonBlank(
                stringOrNull(claims.get("name")),
                stringOrNull(claims.get("given_name")),
                email
        );

        // 이메일이 반드시 필요하다면 여기서 검증
        if (email == null) {
            // 필요 시 sub를 대체키로 쓰거나 예외 처리
            email = stringOrNull(claims.get("sub"));
        }

        // 가입/조회
        UserEntity user = joinService.registerSocialUserIfNotExist(email, name, null);

        // 권한/토큰/유저정보 그대로 사용
        Collection<? extends GrantedAuthority> authorities = oidcUser.getAuthorities();
        OidcIdToken idToken = oidcUser.getIdToken();
        OidcUserInfo userInfo = oidcUser.getUserInfo();

        // name attribute key: 없으면 OIDC 기본 "sub"
        String nameAttrKey = Objects.requireNonNullElse(
                userRequest.getClientRegistration()
                        .getProviderDetails()
                        .getUserInfoEndpoint()
                        .getUserNameAttributeName(),
                "sub"
        );

        // 커스텀 OIDC 유저로 반환
        return new CustomOidcUser(authorities, idToken, userInfo, nameAttrKey, user);
    }

    private static String stringOrNull(Object o) {
        return o == null ? null : String.valueOf(o);
    }

    @SafeVarargs
    private static String firstNonBlank(String... vals) {
        for (String v : vals) if (v != null && !v.isBlank()) return v;
        return null;
    }
}
