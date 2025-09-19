package org.muhan.oasis.user.dto.out;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import org.muhan.oasis.valueobject.Language;
import org.muhan.oasis.valueobject.Role;

@Setter
@Getter
@AllArgsConstructor
@Builder
public class UserDetailsResponseDto {
    private String uuid;
    private String nickname;
    private String email;
    private String profileUrl;
    private Role role;
    private Language language;
}
