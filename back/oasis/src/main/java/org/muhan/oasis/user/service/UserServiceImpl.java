package org.muhan.oasis.user.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.muhan.oasis.common.base.BaseResponseStatus;
import org.muhan.oasis.common.exception.BaseException;
import org.muhan.oasis.s3.service.S3StorageService;
import org.muhan.oasis.stay.entity.CancellationPolicyEntity;
import org.muhan.oasis.stay.entity.StayEntity;
import org.muhan.oasis.stay.repository.CancellationPolicyRepository;
import org.muhan.oasis.stay.repository.StayRepository;
import org.muhan.oasis.stay.service.StayService;
import org.muhan.oasis.user.dto.in.CancellationPolicyRequestDto;
import org.muhan.oasis.user.dto.in.UpdateCancellationPolicyRequestDto;
import org.muhan.oasis.user.dto.out.UserDetailsResponseDto;
import org.muhan.oasis.user.entity.UserEntity;
import org.muhan.oasis.user.repository.UserRepository;
import org.muhan.oasis.user.vo.out.CancellationPolicyResponseVo;
import org.muhan.oasis.user.vo.out.UserBriefResponseVo;
import org.muhan.oasis.user.vo.out.UserSearchResultResponseVo;
import org.muhan.oasis.valueobject.Language;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.net.URI;
import java.util.List;
import java.util.Optional;


@Service
@Log4j2
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final S3StorageService s3StorageService;
    private final CancellationPolicyRepository cancellationPolicyRepository;
    private final UserExistService userExistService;
    private final StayRepository stayRepository;


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
        UserEntity user = userExistService.userExist(userId);

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
        UserEntity user = userExistService.userExist(userId);
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
    public void updateLang(Long userId, Language lang) {
        // 유저 유효성 검사
        userExistService.userExist(userId);

        int updated = userRepository.updateLanguageById(userId, lang);
        if (updated == 0) {
            log.warn("[updateLang] no rows updated. userId={}", userId);
            throw new BaseException(BaseResponseStatus.NO_EXIST_USER);
        }
        log.info("[updateLang] language updated. userId={}, language={}", userId, lang);
    }

    @Override
    @Transactional
    public void registCancellationPolicy(Long userId, CancellationPolicyRequestDto dto) {
        UserEntity user = userExistService.userExist(userId);

        CancellationPolicyEntity policy = CancellationPolicyEntity.builder()
                .user(user)
                .policy1(dto.getPolicy1())
                .policy2(dto.getPolicy2())
                .policy3(dto.getPolicy3())
                .policy4(dto.getPolicy4())
                .build();
        cancellationPolicyRepository.save(policy);
    }

    @Override
    @Transactional
    public void updateCancellationPolicy(Long userId, UpdateCancellationPolicyRequestDto dto) {
        // 유저 유효성 검사
        UserEntity user = userExistService.userExist(userId);

        // 기존 활성화 정책 조회
        CancellationPolicyEntity oldPolicy = cancellationPolicyRepository
                .findTopByUser_UserIdAndActiveTrueOrderByIdDesc(userId)
                .orElseThrow(() -> new BaseException(BaseResponseStatus.NO_EXIST_CANCELLATION_POLICY));

        // 기존 정책 비활성화
        int updated = cancellationPolicyRepository.updatePolicy(oldPolicy.getId(), false);
        if (updated == 0) {
            log.warn("[updateCancellationPolicy] no rows updated. policyId={}", oldPolicy.getId());
            throw new BaseException(BaseResponseStatus.NO_EXIST_CANCELLATION_POLICY);
        }
        log.info("[updateCancellationPolicy] Policy deactivated. policyId={}", oldPolicy.getId());

        // 새로운 정책 등록
        CancellationPolicyEntity newPolicy = cancellationPolicyRepository.save(
                CancellationPolicyEntity.builder()
                        .user(user)
                        .policy1(dto.getPolicy1())
                        .policy2(dto.getPolicy2())
                        .policy3(dto.getPolicy3())
                        .policy4(dto.getPolicy4())
                        .active(true) // 새 정책은 활성화
                        .build()
        );

        // 숙소들에 새로운 정책 바인딩
        stayRepository.rebindCancellationPolicy(oldPolicy, newPolicy);

        log.info("[updateCancellationPolicy] Policy created. policyId={}", newPolicy.getId());
    }

    @Override
    public Long getUserIdByUserUuid(String userUuid) {
        return userRepository.findByUserUuid(userUuid).get().getUserId();
    }

    @Override
    public String getUserEmailByUuid(String userUuid) {
        return userRepository.findByUserUuid(userUuid).get().getEmail();
    }

    @Override
    @Transactional(readOnly = true)
    public CancellationPolicyResponseVo getCancellationPolicy(Long userId) {
        CancellationPolicyEntity entity = cancellationPolicyRepository
                .findTopByUser_UserIdAndActiveTrueOrderByIdDesc(userId)
                .orElseThrow(() -> new BaseException(BaseResponseStatus.NO_EXIST_CANCELLATION_POLICY));

        return toResponseVo(entity);
    }

    private CancellationPolicyResponseVo toResponseVo(CancellationPolicyEntity entity) {
        return CancellationPolicyResponseVo.builder()
                .id(entity.getId())
                .policy1(entity.getPolicy1())
                .policy2(entity.getPolicy2())
                .policy3(entity.getPolicy3())
                .policy4(entity.getPolicy4())
                .build();
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
