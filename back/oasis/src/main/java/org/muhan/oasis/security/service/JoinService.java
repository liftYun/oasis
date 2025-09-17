package org.muhan.oasis.security.service;

import jakarta.annotation.Nullable;
import jakarta.transaction.Transactional;
import org.muhan.oasis.user.entity.UserEntity;
import org.muhan.oasis.user.repository.UserRepository;
import org.muhan.oasis.valueobject.Language;
import org.muhan.oasis.valueobject.Role;
import org.springframework.stereotype.Service;

import java.util.UUID;

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
                    null
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

        // 닉네임이 변경되는 경우 중복 확인
        if (!nickname.equals(user.getNickname())
                && userRepository.existsByNickname(nickname)) {
            throw new DuplicateNicknameException("이미 사용 중인 닉네임입니다.");
        }

        user.setNickname(nickname);
        if (language != null) user.setLanguage(Language.valueOf(language));

        // 역할 변경 (최초 가입 시 ROLE_GUEST였다가 ROLE_HOST로 승급하는 케이스)
        if (role != null) {
            // Enum 변환 예: Role.valueOf("ROLE_HOST")
            user.setRole(user.getRole());
        }

        return userRepository.save(user);
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
