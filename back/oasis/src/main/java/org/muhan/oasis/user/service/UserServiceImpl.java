package org.muhan.oasis.user.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.muhan.oasis.common.base.BaseResponseStatus;
import org.muhan.oasis.common.exception.BaseException;
import org.muhan.oasis.user.dto.out.UserDetailsResponseDto;
import org.muhan.oasis.user.entity.UserEntity;
import org.muhan.oasis.user.repository.UserRepository;
import org.muhan.oasis.user.vo.out.UserBriefResponseVo;
import org.muhan.oasis.user.vo.out.UserDetailsResponseVo;
import org.muhan.oasis.user.vo.out.UserSearchResultResponseVo;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
@Log4j2
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;

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
                user.getProfileImg(),
                user.getRole(),
                user.getLanguage()
        );
    }
}
