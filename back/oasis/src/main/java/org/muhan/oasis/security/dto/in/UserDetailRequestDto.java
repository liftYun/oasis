package org.muhan.oasis.security.dto.in;

import lombok.*;
import org.muhan.oasis.security.entity.UserEntity;
import org.muhan.oasis.valueobject.Language;

@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Builder
public class UserDetailRequestDto {
    private int id;
    private String uuid;
    private String nickname;
    private String userEmail;
    private String role;
    private Language language;

    public static UserEntity from(UserDetailRequestDto dto){
        return UserEntity.builder()
                .id(dto.id)
                .uuid(dto.uuid)
                .userEmail(dto.userEmail)
                .role(dto.role)
                .language(dto.language)
                .build();
    }

}
