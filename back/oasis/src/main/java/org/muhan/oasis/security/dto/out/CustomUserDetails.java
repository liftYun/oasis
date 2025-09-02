package org.muhan.oasis.security.dto.out;

import org.muhan.oasis.security.entity.UserEntity;
import org.muhan.oasis.valueobject.Language;
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

                return userEntity.getRole();
            }
        });

        return collection;
    }
    public UserEntity getUserEntity() {
        return this.userEntity;
    }

    public long getUserId() { return userEntity.getId(); }

    public String getUserUuid() { return userEntity.getUuid(); }

    public String getUserEmail() { return  userEntity.getUserEmail(); }

    public String getUserNickname() { return userEntity.getNickname(); }

    public String getRole() { return userEntity.getRole(); }

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
