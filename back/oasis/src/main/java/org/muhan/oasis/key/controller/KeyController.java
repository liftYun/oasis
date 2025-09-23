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
import org.muhan.oasis.key.dto.out.KeyResponseDto;
import org.muhan.oasis.key.service.KeyService;
import org.muhan.oasis.key.vo.in.ShareKeyRequestVo;
import org.muhan.oasis.key.vo.out.ListOfKeyResponseVO;
import org.muhan.oasis.mqtt.service.MqttPublisherService;
import org.muhan.oasis.mqtt.vo.in.MqttPublishRequestVo;
import org.muhan.oasis.security.dto.out.CustomUserDetails;
import org.muhan.oasis.user.service.UserService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@ResponseBody
@Log4j2
@RequestMapping("/api/v1/key")
@Tag(name = "디지털 키", description = "숙소 디지털 키 발급/개폐 관련 API")
public class KeyController {
    private final KeyService keyService;
    private final UserService userService;
    private final MqttPublisherService mqttPublisher;

    @Value("${device.servo.default-action:MOVE}")
    private String openAction;

    @Value("${device.servo.default-move-angle:90}")
    private int moveAngle;

    @Value("${device.servo.default-home-angle:0}")
    private int homeAngle;

    @Value("${device.servo.default-duration-sec:5}")
    private int durationSec;

    public KeyController(KeyService keyService, UserService userService, MqttPublisherService mqttPublisher) {
        this.keyService = keyService;
        this.userService = userService;
        this.mqttPublisher = mqttPublisher;
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
                ### 발행 토픽/페이로드
                - topic: `cmd/{deviceId}/open` (verifyOpenPermission이 `cmd/{deviceId}/open`을 반환)
                - payload(JSON): `{"action":".","moveAngle":...,"homeAngle":...,"durationSec":...,"cmdId":"..."}`
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
            @AuthenticationPrincipal CustomUserDetails customUserDetails
    ) {
        Long userId = userService.getUserIdByUserUuid(customUserDetails.getUserUuid());
        String topic = keyService.verifyOpenPermission(userId, keyId);

        String commandId = "cmd-" + UUID.randomUUID();

        String payload = """
                {"action":"%s","moveAngle":%d,"homeAngle":%d,"durationSec":%d, "cmdId":"%s"}
                """.formatted(openAction, moveAngle, homeAngle, durationSec, commandId).replaceAll("\\s+","");

        mqttPublisher.publish(topic, payload, 1, false);

        return BaseResponse.of(Map.of(
                "commandId", commandId,
                "topic", topic,
                "published", true
        ));
    }

    @Operation(
            summary = "[테스트] 임의 토픽으로 MQTT 발행",
            description = """
                로컬/포스트맨에서 topic/payload를 보내면 서버가 그대로 브로커에 발행합니다.
                운영에서는 ROLE 제한 또는 비활성화를 권장합니다.
                """
    )
    @PostMapping("/publish")
    public BaseResponse<?> publishTest(
            @RequestBody MqttPublishRequestVo vo,
            @AuthenticationPrincipal CustomUserDetails customUserDetails
    ) {
        String topic = vo.getTopic();
        String payload = (vo.getPayload() == null) ? "" : vo.getPayload();
        mqttPublisher.publish(topic, payload, vo.getQos(), vo.getRetain());
        return BaseResponse.of(Map.of(
                "topic", topic,
                "payload", payload,
                "published", true
        ));
    }


    @Operation(
            summary = "디지털 키 리스트",
            description = """
                - 사용자가 지닌 키 리스트를 반환합니다.
                """
    )
    @GetMapping("/list")
    public BaseResponse<?> listOfKeys(@AuthenticationPrincipal CustomUserDetails customUserDetails) {
        Long userId = userService.getUserIdByUserUuid(customUserDetails.getUserUuid());

        List<KeyResponseDto> items = keyService.listKeysForGuest(userId);
        ListOfKeyResponseVO body = ListOfKeyResponseVO.builder()
                .listOfKeys(items)
                .build();
        return BaseResponse.of(body);
    }
}
