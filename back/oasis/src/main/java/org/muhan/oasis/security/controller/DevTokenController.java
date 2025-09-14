package org.muhan.oasis.security.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.muhan.oasis.common.base.BaseResponse;
import org.muhan.oasis.security.jwt.JWTUtil;
import org.muhan.oasis.user.entity.UserEntity;
import org.muhan.oasis.user.repository.UserRepository;
import org.muhan.oasis.valueobject.Language;
import org.muhan.oasis.valueobject.Role;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Profile;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/dev")
@RequiredArgsConstructor
@Tag(name = "개발용 토큰", description = "로컬/개발 환경 테스트용 AccessToken 발급")
//@Profile({"dev","local"}) // ⚠️ 운영 차단
public class DevTokenController {

    private final UserRepository userRepository;
    private final JWTUtil jwtUtil;

    @Operation(summary="게스트 AT(70일)")
    @GetMapping("/token/guest")
    public BaseResponse<Map<String,Object>> guestToken() {
        return issueFixed("testGuest@test.com");
    }

    @Operation(summary="호스트 AT(70일)")
    @GetMapping("/token/host")
    public BaseResponse<Map<String,Object>> hostToken() {
        return issueFixed("testHost@test.com");
    }

    private BaseResponse<Map<String,Object>> issueFixed(String email) {
        UserEntity u = userRepository.findByEmail(email).orElseThrow();
        String at = jwtUtil.createAccessToken(u.getUserUuid(), u.getEmail(), u.getNickname(),
                u.getRole() != null ? u.getRole() : Role.ROLE_GUEST,
                u.getLanguage() != null ? u.getLanguage() : Language.KOR);
        return BaseResponse.of(Map.of("accessToken", at, "tokenType", "Bearer"));
    }


    public record IssueTokenRequest(String email) {}
}
