package org.muhan.oasis.security.vo.in;

import lombok.Builder;
import lombok.Getter;
import org.muhan.oasis.security.dto.in.RegistRequestDto;

//@Setter
@Getter
@Builder
public class RegistRequestVo {
    private String nickname;
    private String userEmail;
    private String role;

    public static RegistRequestDto from(RegistRequestVo vo){

        return RegistRequestDto.builder()
                .nickname(vo.nickname)
                .userEmail(vo.userEmail)
                .role(vo.role)
                .build();

    }

}
