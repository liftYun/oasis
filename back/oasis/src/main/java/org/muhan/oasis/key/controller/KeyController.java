package org.muhan.oasis.key.controller;

import lombok.extern.log4j.Log4j2;
import org.muhan.oasis.common.base.BaseResponse;
import org.muhan.oasis.key.service.KeyService;
import org.muhan.oasis.key.vo.in.ShareKeyRequestVo;
import org.muhan.oasis.security.dto.out.CustomUserDetails;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@ResponseBody
@Log4j2
@RequestMapping("/api/v1/key")
public class KeyController {
    private final KeyService keyService;

    public KeyController(KeyService keyService) {
        this.keyService = keyService;
    }

    @PostMapping("/issue")
    public BaseResponse<?> generation(@RequestBody ShareKeyRequestVo shareKeyRequestVo) {
        return BaseResponse.of(keyService.issueKeysForAllUsers(shareKeyRequestVo.toDto()));
    }

    @PostMapping("/{keyId}/open")
    public BaseResponse<?> open(
            @PathVariable Long keyId, @AuthenticationPrincipal CustomUserDetails customUserDetails) {
        // MQTT 발행
        String commandId = keyService.verifyOpenPermission(customUserDetails.getUserId(), keyId);

        return BaseResponse.of(Map.of("commandId", commandId));
    }
}
