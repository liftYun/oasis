package org.muhan.oasis.security.service;

import org.muhan.oasis.security.entity.UserEntity;
import org.muhan.oasis.security.jwt.CustomOAuth2User;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class CustomOAuth2UserService
        extends DefaultOAuth2UserService {

    private final JoinService joinService;

    public CustomOAuth2UserService(JoinService joinService) {
        this.joinService = joinService;
    }

    @Override
    public OAuth2User loadUser(OAuth2UserRequest req)
            throws OAuth2AuthenticationException {

        OAuth2User oAuth2User = super.loadUser(req);
        String regId = req.getClientRegistration()
                .getRegistrationId();  // "kakao","google","naver" 등

        Map<String,Object> attrs = oAuth2User.getAttributes();
        String email, nickname;

        switch(regId) {
            case "kakao":
                Map<String,Object> kakaoAcc = (Map)attrs.get("kakao_account");
                email    = kakaoAcc.get("email").toString();
                Map<String,Object> prof = (Map)kakaoAcc.get("profile");
                nickname = prof.get("nickname").toString();
            case "naver":
                Map<String,Object> resp = (Map)attrs.get("response");
                email    = resp.get("email").toString();
                nickname = resp.get("name").toString();
                break;
            default:  // google
                email    = attrs.get("email").toString();
                nickname = attrs.get("name").toString();
                break;
        }

        // 소셜로 가입만 한 상태 -> 추가적인 정보 필요.
        UserEntity user = joinService
                .registerSocialUserIfNotExist(email, nickname);

        // CustomOAuth2User 또는 DefaultOAuth2User 반환
        return new CustomOAuth2User(user, attrs);
    }
}
