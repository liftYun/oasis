package org.muhan.oasis.user.vo.out;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import org.muhan.oasis.user.dto.out.UserDetailsResponseDto;
import org.muhan.oasis.valueobject.Language;
import org.muhan.oasis.valueobject.Role;

@Getter
@AllArgsConstructor
@Builder
public class UserDetailsResponseVo {
    private String uuid;
    private String nickname;
    private String email;
    private String profileUrl;
    private Role role;
    private Language language;

    public static UserDetailsResponseVo from(UserDetailsResponseDto userDetailsResponseDto) {
        return UserDetailsResponseVo.builder()
                .uuid(userDetailsResponseDto.getUuid())
                .nickname(userDetailsResponseDto.getNickname())
                .email(userDetailsResponseDto.getEmail())
                .profileUrl(userDetailsResponseDto.getProfileUrl())
                .role(userDetailsResponseDto.getRole())
                .language(userDetailsResponseDto.getLanguage())
                .build();
    }
}
