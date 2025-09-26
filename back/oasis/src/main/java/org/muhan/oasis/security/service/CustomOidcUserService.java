package org.muhan.oasis.security.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.muhan.oasis.user.entity.UserEntity;
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

import java.util.*;

@Service
@Log4j2
@RequiredArgsConstructor
public class CustomOidcUserService implements OAuth2UserService<OidcUserRequest, OidcUser> {

    private final JoinService joinService;

    @Override
    public OidcUser loadUser(OidcUserRequest userRequest) throws OAuth2AuthenticationException {
        OidcUserService delegate = new OidcUserService();
        OidcUser oidcUser = delegate.loadUser(userRequest);

        Map<String, Object> claims = new LinkedHashMap<>(oidcUser.getClaims());
        Map<String, Object> attrs  = new LinkedHashMap<>(oidcUser.getAttributes()); // provider attributes
        OidcUserInfo userInfo     = oidcUser.getUserInfo();
        Map<String, Object> userInfoClaims = userInfo != null ? userInfo.getClaims() : Collections.emptyMap();

        // 가시성 높은 1회성 로그 (점검 후 DEBUG로 내리세요)
        log.info("[OIDC] provider={}, scopes={}, idTokenClaims={}",
                userRequest.getClientRegistration().getRegistrationId(),
                userRequest.getAccessToken().getScopes(),
                safeKeys(claims));
        log.info("[OIDC] userInfoClaimsKeys={}, attributesKeys={}",
                safeKeys(userInfoClaims), safeKeys(attrs));

        String email = firstNonBlank(
                str(claims.get("email")),
                str(userInfoClaims.get("email")),
                str(attrs.get("email"))
        );

        String name = firstNonBlank(
                str(claims.get("name")),
                str(claims.get("given_name")),
                str(userInfoClaims.get("name")),
                str(attrs.get("name")),
                email
        );

        // 구글 프로필 이미지는 일반적으로 "picture"
        String profileUrl = firstNonBlank(
                str(claims.get("picture")),          // ✅ 가장 흔한 위치
                str(userInfoClaims.get("picture")),
                str(attrs.get("picture")),
                str(claims.get("profile")),          // 드물게 'profile'
                str(claims.get("profile_url"))       // 호환성
        );

        log.info("[OIDC] resolved email={}, name={}, picture={}", email, name, profileUrl);
        log.info("[CustomOidcUserService] raw email={}, name={}, profileUrl={}", email, name, profileUrl);

        if (email == null) {
            // 이메일이 필수라면 여기서 예외를 던지거나 sub로 대체
            email = str(claims.get("sub"));
        }

        // 가입/조회
        UserEntity user = joinService.registerSocialUserIfNotExist(email, name, profileUrl, null);

        Collection<? extends GrantedAuthority> authorities = oidcUser.getAuthorities();
        OidcIdToken idToken = oidcUser.getIdToken();

        String nameAttrKey = Optional.ofNullable(
                userRequest.getClientRegistration()
                        .getProviderDetails()
                        .getUserInfoEndpoint()
                        .getUserNameAttributeName()
        ).orElse("sub");

        return new CustomOidcUser(authorities, idToken, userInfo, nameAttrKey, user);
    }

    private static String str(Object o) { return o == null ? null : String.valueOf(o); }

    private static String firstNonBlank(String... vals) {
        for (String v : vals) if (v != null && !v.isBlank()) return v;
        return null;
    }

    private static Map<String, Object> safeKeys(Map<String, Object> map) {
        if (map == null) return Collections.emptyMap();
        // 값 대신 키만 찍어서 민감정보 노출 최소화
        Map<String, Object> out = new LinkedHashMap<>();
        for (String k : map.keySet()) out.put(k, "[*]");
        return out;
    }
}
