package org.muhan.oasis.security.dto.in;

import lombok.*;
import org.muhan.oasis.user.entity.UserEntity;
import org.muhan.oasis.valueobject.Language;
import org.muhan.oasis.valueobject.Role;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RegistRequestDto {
    private String uuid;
    private String nickname;
    private String userEmail;
    private String profileKey;
    private String profileUrl;
    private Language language;
    private String certificateKey;
    private String certificateUrl;
    private Role role;

    public static UserEntity from(RegistRequestDto dto){
        return UserEntity.builder()
                .userUuid(dto.uuid)
                .nickname(dto.nickname)
                .email(dto.userEmail)
                .role(dto.role)
                .language(dto.language)
                .certificateKey(dto.certificateKey)
                .certificateUrl(dto.certificateUrl)
                .profileKey(dto.profileKey)
                .profileUrl(dto.profileUrl)
                .build();
    }
}
