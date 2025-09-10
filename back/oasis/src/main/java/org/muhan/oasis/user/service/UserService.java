package org.muhan.oasis.user.service;

import org.muhan.oasis.user.dto.out.UserDetailsResponseDto;
import org.muhan.oasis.user.vo.out.UserDetailsResponseVo;
import org.muhan.oasis.user.vo.out.UserSearchResultResponseVo;
import org.muhan.oasis.valueobject.Language;

import java.util.List;

public interface UserService {
    UserSearchResultResponseVo autocomplete(String keyword, int page, int size, List<Long> excludeIds);

    Long getUserIdByExactNickname(String nickname);

    UserDetailsResponseDto getUser(Long userId);

    void updateProfileImageUrl(Long userId, String imageUrl);

    boolean updateLang(Long userId, Language lang);
}
