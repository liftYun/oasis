package org.muhan.oasis.security.dto.in;

import lombok.*;
import org.muhan.oasis.security.entity.UserEntity;
import org.muhan.oasis.valueobject.Language;
import org.muhan.oasis.valueobject.Role;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RegistRequestDto {
    private long uuid;
    private String nickname;
    private String userEmail;
    private String profileImage;
    private Language language;
    private String certificateImg;
    private Role role;

    public static UserEntity from(RegistRequestDto dto){
        return UserEntity.builder()
                .uuid(dto.uuid)
                .nickname(dto.nickname)
                .email(dto.userEmail)
                .role(dto.role)
                .language(dto.language)
                .certificateImg(dto.certificateImg)
                .profileImage(dto.profileImage)
                .build();
    }
}
