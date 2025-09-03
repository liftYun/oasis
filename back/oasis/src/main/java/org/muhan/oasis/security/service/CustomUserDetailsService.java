package org.muhan.oasis.security.service;

import org.muhan.oasis.security.dto.out.CustomUserDetails;
import org.muhan.oasis.security.entity.UserEntity;
import org.muhan.oasis.security.repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {

        this.userRepository = userRepository;
    }

    public UserDetails loadUserByNickname(String nickname) throws UsernameNotFoundException {

        UserEntity userData = userRepository.findByNickname(nickname);

        if(userData != null) {
            return new CustomUserDetails(userData);
        }

        return null;
    }

    public CustomUserDetails loadUserByUuid(Long uuid) {

        return userRepository.findByUuid(uuid)
                .map(CustomUserDetails::new)
                .orElse(null);
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return null;
    }
}
