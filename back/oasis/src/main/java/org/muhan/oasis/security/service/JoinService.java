package org.muhan.oasis.security.service;

import jakarta.annotation.Nullable;
import jakarta.transaction.Transactional;
import org.muhan.oasis.security.dto.in.RegistRequestDto;
import org.muhan.oasis.security.entity.UserEntity;
import org.muhan.oasis.security.repository.UserRepository;
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

//    public void joinProcess(RegistRequestDto registRequestDto) {
//
//        String nickname = registRequestDto.getNickname();
//        if (userRepository.existsByNickname(nickname)) {
//
//            return;
//        }
//
//        UserEntity data = new UserEntity();
//
//        data.setUuid(java.util.UUID.randomUUID().toString());
//        data.setNickname(registRequestDto.getNickname());
//        data.setUserEmail(registRequestDto.getUserEmail());
//        data.setRole(registRequestDto.getRole());
//        data.setLanguage(registRequestDto.getLanguage());
//
//        userRepository.save(data);
//    }

//    public UserEntity registerSocialUserIfNotExist(String email, String nickname) {
//        return userRepository.findByEmail(email)
//                .orElseGet(() -> {
//                    UserEntity member = UserEntity.builder()
//                            .uuid(Long.valueOf(UUID.randomUUID().toString()))
//                            .email(email)
//                            .nickname(nickname)
//                            .build();
//                    return userRepository.save(member);
//                });
//    }

    // 소셜 로그인: 없으면 생성
    @Transactional
    public UserEntity registerSocialUserIfNotExist(String email, String nickname, @Nullable Language lang) {
        return userRepository.findByEmail(email).orElseGet(() -> {
            UserEntity u = new UserEntity();
            u.setEmail(email);
            u.setNickname(safeNickname(nickname));          // null/중복 방지 정책 적용 권장
            u.setRole(Role.ROLE_GUEST);                     // 소셜 최초는 게스트
            u.setLanguage(lang != null ? lang : Language.KOR); // 기본값
            u.setProfileImage(defaultProfile());            // NOT NULL
            return userRepository.save(u);
        });
    }
    @Transactional
    public void updateLanguage(Long uuid, Language lang) {
        userRepository.findByUuid(uuid).ifPresent(user -> {
            user.setLanguage(lang);
            userRepository.save(user);
        });
    }

    @Transactional
    public UserEntity completeProfile(Long uuid, String nickname, String profileImageUrl, String role, String language) {
        UserEntity user = userRepository.findByUuid(uuid)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        // 닉네임이 변경되는 경우 중복 확인
        if (!nickname.equals(user.getNickname())
                && userRepository.existsByNickname(nickname)) {
            throw new DuplicateNicknameException("이미 사용 중인 닉네임입니다.");
        }

        user.setNickname(nickname);
        if (profileImageUrl != null) user.setProfileImage(profileImageUrl);
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

    private String defaultProfile() {
        return "https://your-cdn.example.com/static/img/profile/default.png";
    }

    private String safeNickname(String nickname) {
        // null/공백 → email 로컬 파트 사용 등 정책
        return (nickname == null || nickname.isBlank()) ? "user" + System.nanoTime() : nickname;
    }
}
