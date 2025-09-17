package org.muhan.oasis.security.vo.in;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Builder;
import lombok.Getter;
import org.muhan.oasis.security.dto.in.RegistRequestDto;
import org.muhan.oasis.valueobject.Language;

@Getter
@Builder
public class RegistRequestVo {

    @NotBlank(message = "닉네임은 필수입니다.")
    @Pattern(regexp = "^[A-Za-z0-9가-힣_\\-]{2,20}$", message = "닉네임 형식이 올바르지 않습니다.")
    private String nickname;

    // ROLE_GUEST 또는 ROLE_HOST
    @NotBlank(message = "역할은 필수입니다.")
    @Pattern(regexp = "ROLE_GUEST|ROLE_HOST", message = "역할은 ROLE_GUEST 또는 ROLE_HOST 만 허용됩니다.")
    private String role;

    // 선택: ko/en 등 화이트리스트 권장
    @Pattern(regexp = "KOR|ENG", message = "지원하지 않는 언어 코드입니다.")
    private String language;
}
