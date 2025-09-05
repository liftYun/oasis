package org.muhan.oasis.security.jwt;

import org.muhan.oasis.user.entity.UserEntity;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.core.oidc.OidcUserInfo;
import org.springframework.security.oauth2.core.oidc.user.DefaultOidcUser;
import org.springframework.security.oauth2.core.oidc.OidcIdToken;

import java.util.Collection;

public class CustomOidcUser extends DefaultOidcUser {

    private final UserEntity user;

    public CustomOidcUser(Collection<? extends GrantedAuthority> authorities,
                          OidcIdToken idToken,
                          OidcUserInfo userInfo,
                          String nameAttributeKey,
                          UserEntity user) {
        super(authorities, idToken, userInfo, nameAttributeKey);
        this.user = user;
    }

    public UserEntity getUser() {
        return user;
    }
}
