package org.muhan.oasis.security.dto.in;

import lombok.*;
import org.muhan.oasis.security.entity.UserEntity;
import org.muhan.oasis.valueobject.Language;
import org.muhan.oasis.valueobject.Role;

@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Builder
public class UserDetailRequestDto {
    private Long uuid;
    private String nickname;
    private String userEmail;
    private Role role;
    private Language language;

    public static UserEntity from(UserDetailRequestDto dto){
        return UserEntity.builder()
                .uuid(dto.uuid)
                .email(dto.userEmail)
                .role(dto.role)
                .language(dto.language)
                .build();
    }

}
