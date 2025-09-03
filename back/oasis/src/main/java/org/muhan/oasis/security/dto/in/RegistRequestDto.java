package org.muhan.oasis.security.dto.in;

import lombok.*;
import org.muhan.oasis.security.entity.UserEntity;
import org.muhan.oasis.valueobject.Language;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RegistRequestDto {
    private long id;
    private String nickname;
    private String userEmail;
    private String profileUrl;
    private Language language;
    private String certificateUrl;
    private String role;

    public static UserEntity from(RegistRequestDto dto){
        return UserEntity.builder()
                .id(dto.id)
                .nickname(dto.nickname)
                .userEmail(dto.userEmail)
                .role(dto.role)
                .language(dto.language)
                .certificateUrl(dto.certificateUrl)
                .profileUrl(dto.profileUrl)
                .build();
    }
}
