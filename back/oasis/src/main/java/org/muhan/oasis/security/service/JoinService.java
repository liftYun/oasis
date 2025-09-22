package org.muhan.oasis.security.service;

import jakarta.annotation.Nullable;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.muhan.oasis.user.entity.UserEntity;
import org.muhan.oasis.user.repository.UserRepository;
import org.muhan.oasis.valueobject.Language;
import org.muhan.oasis.valueobject.Role;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Slf4j
@Service
public class JoinService {

    private final UserRepository userRepository;

    public JoinService(UserRepository userRepository) {

        this.userRepository = userRepository;
    }

    // 소셜 로그인: 없으면 생성
    @Transactional
    public UserEntity registerSocialUserIfNotExist(String email, String nickname, String profileUrl, @Nullable Language lang) {
        System.out.println("JoinService in Email : " + email);
        return userRepository.findByEmail(email).orElseGet(() -> {
            Language useLang = (lang != null) ? lang : org.muhan.oasis.valueobject.Language.KOR;
            UserEntity u = new UserEntity(
                    UUID.randomUUID().toString(),
                    Role.ROLE_GUEST,
                    safeNickname(nickname),
                    profileUrl,
                    email,
                    useLang,
                    true
            );

            return userRepository.save(u);
        });
    }
    @Transactional
    public void updateLanguage(String uuid, Language lang) {
        userRepository.findByUserUuid(uuid).ifPresent(user -> {
            user.setLanguage(lang);
            userRepository.save(user);
        });
    }

    @Transactional
    public UserEntity completeProfile(String uuid, String nickname, String role, String language) {
        UserEntity user = userRepository.findByUserUuid(uuid)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));


        user.setNickname(nickname);
        if (language == null) language = user.getLanguage().toString();

        if (role == null) role = user.getRole().toString();
        else role = role.toUpperCase();

        log.info("[JoinService] completeProfile userId : {},nickname : {},role : {},language : {}",user.getUserId() ,nickname,role,language);

        userRepository.updateUserById(user.getUserId(), nickname, Language.valueOf(language), Role.valueOf(role), true);

        return userRepository.findByUserId(user.getUserId()).orElseThrow();
    }

    public static class DuplicateNicknameException extends RuntimeException {
        public DuplicateNicknameException(String msg) { super(msg); }
    }

    private String safeNickname(String nickname) {
        // null/공백 → email 로컬 파트 사용 등 정책
        return (nickname == null || nickname.isBlank()) ? "user" + System.nanoTime() : nickname;
    }

    public boolean existsByNickname(String nickname) {
        return userRepository.existsByNickname(nickname);
    }
}
