package org.muhan.oasis.user.service;

import org.muhan.oasis.user.dto.in.CancellationPolicyRequestDto;
import org.muhan.oasis.user.dto.in.UpdateCancellationPolicyRequestDto;
import org.muhan.oasis.user.dto.out.UserDetailsResponseDto;
import org.muhan.oasis.user.vo.out.UserSearchResultResponseVo;
import org.muhan.oasis.valueobject.Language;

import java.util.List;

public interface UserService {
    UserSearchResultResponseVo autocomplete(String keyword, int page, int size, List<Long> excludeIds);

    Long getUserIdByExactNickname(String nickname);

    UserDetailsResponseDto getUser(Long userId);

    void updateProfileImageUrl(Long userId, String imageUrl);

    void updateLang(Long userId, Language lang);

    void registCancellationPolicy(Long userId, CancellationPolicyRequestDto dto);

    void updateCancellationPolicy(Long userId, UpdateCancellationPolicyRequestDto from);
}
