package org.muhan.oasis.user.service;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.muhan.oasis.common.base.BaseResponseStatus;
import org.muhan.oasis.common.exception.BaseException;
import org.muhan.oasis.s3.service.S3StorageService;
import org.muhan.oasis.user.dto.out.UserDetailsResponseDto;
import org.muhan.oasis.user.entity.UserEntity;
import org.muhan.oasis.user.repository.UserRepository;
import org.muhan.oasis.user.vo.out.UserBriefResponseVo;
import org.muhan.oasis.user.vo.out.UserDetailsResponseVo;
import org.muhan.oasis.user.vo.out.UserSearchResultResponseVo;
import org.muhan.oasis.valueobject.Language;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.util.List;
import java.util.Optional;


@Service
@Log4j2
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final S3StorageService s3StorageService;


    @Override
    public UserSearchResultResponseVo autocomplete(String keyword, int page, int size, List<Long> excludeIds) {
        // UX: 2자 미만은 빈 결과(또는 400) 처리가 흔함
        if (keyword == null || keyword.trim().length() < 2) {
            return new UserSearchResultResponseVo(List.of(), page, size, 0, 0);
        }

        Pageable pageable = PageRequest.of(page, size, Sort.by("nickname").ascending());
        Page<UserEntity> result = userRepository.searchByNickname(
                keyword.trim(),
                (excludeIds == null || excludeIds.isEmpty()) ? null : excludeIds,
                pageable
        );

        List<UserBriefResponseVo> list = result.getContent().stream().map(UserBriefResponseVo::from).toList();
        return new UserSearchResultResponseVo(
                list,
                result.getNumber(),
                result.getSize(),
                result.getTotalElements(),
                result.getTotalPages()
        );
    }

    @Override
    public Long getUserIdByExactNickname(String nickname) {
        return userRepository.findByNickname(nickname)
                .map(UserEntity::getUserId)
                .orElseThrow(() -> new BaseException(BaseResponseStatus.NO_EXIST_USER));
    }

    @Override
    public UserDetailsResponseDto getUser(Long userId) {
        UserEntity user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new BaseException(BaseResponseStatus.NO_EXIST_USER));

        return new UserDetailsResponseDto(
                user.getNickname(),
                user.getEmail(),
                user.getProfileUrl(),
                user.getRole(),
                user.getLanguage()
        );
    }

    @Override
    @Transactional
    public void updateProfileImageUrl(Long userId, String newUrl) {
        UserEntity user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));
        String oldUrl = user.getProfileUrl(); // 기존 URL 컬럼명에 맞춰 변경

        user.setProfileUrl(newUrl);
        userRepository.save(user);

        // 이전 이미지 삭제(동일 버킷 경로만 안전하게 처리)
        if (oldUrl != null && !oldUrl.isBlank()) {
            extractKeyIfSameBucket(oldUrl).ifPresent(s3StorageService::delete);
        }
    }

    @Override
    @Transactional
    public boolean updateLang(Long userId, Language lang) {
        int updated = userRepository.updateLanguageById(userId, lang);
        if (updated == 0) {
            log.warn("[updateLang] no rows updated. userId={}", userId);
            throw new EntityNotFoundException("사용자를 찾을 수 없습니다.");
        }
        log.info("[updateLang] language updated. userId={}, language={}", userId, lang);
        return true;
    }

    private Optional<String> extractKeyIfSameBucket(String url) {
        // 운영 환경에 맞게 파싱 로직 구현 (CloudFront or S3 URL → key)
        // 예: https://bucket.s3.amazonaws.com/users/1/profile/xxx.jpg → users/1/profile/xxx.jpg
        try {
            URI uri = URI.create(url);
            return Optional.of(uri.getPath().replaceFirst("^/", ""));
        } catch (Exception e) {
            return Optional.empty();
        }
    }
}
