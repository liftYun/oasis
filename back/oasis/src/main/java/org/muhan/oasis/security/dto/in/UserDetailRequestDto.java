package org.muhan.oasis.security.dto.in;

import lombok.*;
import org.muhan.oasis.user.entity.UserEntity;
import org.muhan.oasis.valueobject.Language;
import org.muhan.oasis.valueobject.Role;

@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Builder
public class UserDetailRequestDto {
    private String uuid;
    private String nickname;
    private String profileImg;
    private Role role;
    private Language language;

    public static UserEntity from(UserDetailRequestDto dto){
        return UserEntity.builder()
                .userUuid(dto.uuid)
                .role(dto.role)
                .nickname(dto.nickname)
                .profileUrl(dto.profileImg)
                .language(dto.language)
                .build();
    }

}
