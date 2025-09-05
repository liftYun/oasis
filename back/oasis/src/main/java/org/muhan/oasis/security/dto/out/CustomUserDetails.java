package org.muhan.oasis.security.dto.out;

import org.muhan.oasis.user.entity.UserEntity;
import org.muhan.oasis.valueobject.Language;
import org.muhan.oasis.valueobject.Role;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.ArrayList;
import java.util.Collection;

public class CustomUserDetails implements UserDetails {

    private final UserEntity userEntity;

    public CustomUserDetails(UserEntity userEntity) {

        this.userEntity = userEntity;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {

        Collection<GrantedAuthority> collection = new ArrayList<>();

        collection.add(new GrantedAuthority() {
            @Override
            public String getAuthority() {
                return userEntity.getRole().name();
            }
        });

        return collection;
    }
    public UserEntity getUserEntity() {
        return this.userEntity;
    }

    public void getUserId() { return; }

    public String getUserUuid() { return userEntity.getUserUuid(); }

    public String getUserEmail() { return  userEntity.getEmail(); }

    public String getUserNickname() { return userEntity.getNickname(); }

    public Role getRole() { return userEntity.getRole(); }

    public Language getLanguage() { return userEntity.getLanguage(); }

    @Override
    public String getPassword() {
        return null;
    }

    @Override
    public String getUsername() {
        return null;
    }

    @Override
    public boolean isAccountNonExpired() {
        return UserDetails.super.isAccountNonExpired();
    }

    @Override
    public boolean isAccountNonLocked() {
//        return UserDetails.super.isAccountNonLocked();
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
//        return UserDetails.super.isCredentialsNonExpired();
        return true;
    }


    @Override
    public boolean isEnabled() {
//        return UserDetails.super.isEnabled();
        return true;
    }
}
