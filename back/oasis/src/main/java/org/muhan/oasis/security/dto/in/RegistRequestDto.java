package org.muhan.oasis.security.dto.in;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.muhan.oasis.security.entity.UserEntity;
import org.muhan.oasis.valueobject.Language;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RegistRequestDto {
    private int id;
    private String nickname;
    private String userEmail;
    private Language language;
    private String role;

    public static UserEntity from(RegistRequestDto dto){
        return UserEntity.builder()
                .id(dto.id)
                .nickname(dto.nickname)
                .userEmail(dto.userEmail)
                .role(dto.role)
                .language(dto.language)
                .build();
    }


}
