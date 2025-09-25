package org.muhan.oasis.charging.controller;

import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.muhan.oasis.charging.dto.in.CharingRequestDto;
import org.muhan.oasis.charging.dto.out.ChargingResponseDto;
import org.muhan.oasis.charging.service.ChargingService;
import org.muhan.oasis.charging.vo.in.ChargingRequestVo;
import org.muhan.oasis.charging.vo.out.ChargingResponseVo;
import org.muhan.oasis.common.base.BaseResponse;
import org.muhan.oasis.security.dto.out.CustomUserDetails;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/charging")
@RequiredArgsConstructor
public class ChargingController {

    private final ChargingService chargingService;

    @Operation(
            summary = "USDC 충전(시연용)",
            description = """
                USDC를 충전합니다.
                """,
            tags = {"충전"}
    )
    @PostMapping()
    public BaseResponse<ChargingResponseVo> topUp(@AuthenticationPrincipal CustomUserDetails customUserDetails,
                                                  @RequestBody ChargingRequestVo vo) throws Exception {

        ChargingResponseDto result = chargingService.charge(CharingRequestDto.from(vo, customUserDetails.getUserUuid()));
        ChargingResponseVo responseVo = new ChargingResponseVo(result.getTxHash(), result.getUsdc());

        return BaseResponse.of(responseVo);
    }
}
