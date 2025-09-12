package org.muhan.oasis.key.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.log4j.Log4j2;
import org.muhan.oasis.common.base.BaseResponse;
import org.muhan.oasis.key.service.KeyService;
import org.muhan.oasis.key.vo.in.ShareKeyRequestVo;
import org.muhan.oasis.security.dto.out.CustomUserDetails;
import org.muhan.oasis.user.service.UserService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@ResponseBody
@Log4j2
@RequestMapping("/api/v1/key")
@Tag(name = "디지털 키", description = "숙소 디지털 키 발급/개폐 관련 API")
public class KeyController {
    private final KeyService keyService;
    private final UserService userService;

    public KeyController(KeyService keyService, UserService userService) {
        this.keyService = keyService;
        this.userService = userService;
    }

    @Operation(
            summary = "예약 단체에 디지털 키 일괄 발급",
            description = """
                하나의 예약(호스트/게스트 포함 참여자)에 대해 디지털 키를 일괄 발급합니다.
                - 입력: 예약 식별자 등 발급에 필요한 정보(ShareKeyRequestVo)
                - 처리: 예약 검증 → 숙소 도어락 장치 확인 → 사용자별 키 생성
                - 반환: 생성된 키 개수 또는 처리 결과 식별자
                """
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "키 발급 성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청(예약/파라미터 오류)"),
            @ApiResponse(responseCode = "404", description = "대상 예약/숙소/장치 없음"),
            @ApiResponse(responseCode = "409", description = "이미 발급된 경우 등 충돌"),
            @ApiResponse(responseCode = "500", description = "서버 내부 오류")
    })
    @PostMapping("/issue")
    public BaseResponse<?> generation(
            @RequestBody ShareKeyRequestVo shareKeyRequestVo
    ) {
        return BaseResponse.of(keyService.issueKeysForAllUsers(shareKeyRequestVo.toDto()));
    }

    @Operation(
            summary = "도어 개방(OPEN) 명령",
            description = """
                사용자가 소유/공유받은 키로 도어 개방을 요청합니다.
                - 서버는 사용자의 개방 권한을 검증합니다.
                - 검증 통과 시 MQTT로 장치에 개방 명령을 발행하고, 명령 트래킹을 위한 commandId를 반환합니다.
                """
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "개방 명령 전송 성공"),
            @ApiResponse(responseCode = "401", description = "인증 필요"),
            @ApiResponse(responseCode = "403", description = "개방 권한 없음"),
            @ApiResponse(responseCode = "404", description = "키 또는 장치/예약 없음"),
            @ApiResponse(responseCode = "409", description = "키 상태/시간 조건 충돌(체크인 전/만료 등)"),
            @ApiResponse(responseCode = "500", description = "서버 내부 오류")
    })
    @PostMapping("/{keyId}/open")
    public BaseResponse<?> open(
            @Parameter(description = "개방에 사용할 키 ID", required = true, example = "1001")
            @PathVariable Long keyId,
            @Parameter(hidden = true)
            @AuthenticationPrincipal CustomUserDetails customUserDetails) {
        // MQTT 발행
        Long userId = userService.getUserIdByUserUuid(customUserDetails.getUserUuid());
        String commandId = keyService.verifyOpenPermission(userId, keyId);

        return BaseResponse.of(Map.of("commandId", commandId));
    }
}
