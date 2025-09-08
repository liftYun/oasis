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

    // 선택: 프로필 이미지 URL
    private String profileImgKey; // 권장: 서버가 안전한 URL 생성
    private String profileImgUrl; // 대안: 이미 생성된 URL 전달 시

    // ROLE_GUEST 또는 ROLE_HOST
    @NotBlank(message = "역할은 필수입니다.")
    @Pattern(regexp = "ROLE_GUEST|ROLE_HOST", message = "역할은 ROLE_GUEST 또는 ROLE_HOST 만 허용됩니다.")
    private String role;

    // 선택: ko/en 등 화이트리스트 권장
    @Pattern(regexp = "kor|eng", message = "지원하지 않는 언어 코드입니다.")
    private String language;
}
