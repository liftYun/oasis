package org.muhan.oasis.key.controller;

import lombok.extern.log4j.Log4j2;
import org.muhan.oasis.common.base.BaseResponse;
import org.muhan.oasis.key.service.KeyService;
import org.muhan.oasis.key.vo.in.ShareKeyRequestVo;
import org.springframework.web.bind.annotation.*;

import static org.muhan.oasis.common.base.BaseResponseStatus.NO_EXIST_USER;

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
}
