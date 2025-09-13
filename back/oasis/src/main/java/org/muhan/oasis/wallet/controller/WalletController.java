package org.muhan.oasis.wallet.controller;


import com.fasterxml.jackson.databind.ObjectMapper;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.muhan.oasis.common.base.BaseResponse;
import org.muhan.oasis.common.base.BaseResponseStatus;
import org.muhan.oasis.security.dto.out.CustomUserDetails;
import org.muhan.oasis.wallet.dto.circle.out.WalletSnapshotResponseDto;
import org.muhan.oasis.wallet.service.WalletService;
import org.muhan.oasis.wallet.vo.in.InitWalletRequestVo;
import org.muhan.oasis.wallet.vo.out.InitWalletResponseVo;
import org.muhan.oasis.wallet.vo.out.WalletSnapshotResponseVo;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/wallet")
@RequiredArgsConstructor
@Slf4j
public class WalletController {

    private final WalletService walletService;

    @Operation(
            summary = "지갑 등록",
            description = """
                지갑이 없는 사용자는 지갑을 등록하고, 지갑이 있는 사용자는 정보를 가져옵니다.
                """,
            tags = {"지갑"}
    )
    @PostMapping("/init-session")
    public BaseResponse<?> createWallet(@AuthenticationPrincipal CustomUserDetails user) {
        try {
            InitWalletResponseVo result = walletService.createAndInitializeWalletSync(user.getUserUuid());
            return BaseResponse.of(result);
        } catch (Exception e) {
            log.error("지갑 초기화 실패", e);
            return BaseResponse.error(BaseResponseStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Operation(
            summary = "지갑 조회",
            description = """
                지갑을 조회합니다.
                """,
            tags = {"지갑"}
    )
    @GetMapping
    public BaseResponse<?> getAddress(@AuthenticationPrincipal CustomUserDetails customUserDetails) {

        if (customUserDetails == null) {
            return BaseResponse.error(BaseResponseStatus.NO_ACCESS_AUTHORITY);
        }

        try {
            WalletSnapshotResponseDto dto = walletService.getWalletSync(customUserDetails.getUserUuid());
            WalletSnapshotResponseVo vo = toVo(dto);
            return BaseResponse.of(vo);
        } catch (Exception e) {
            log.error("지갑 조회 실패", e);
            return BaseResponse.error(BaseResponseStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private WalletSnapshotResponseVo toVo(WalletSnapshotResponseDto dto) {
        return WalletSnapshotResponseVo.builder()
                .wallets(dto.getWallets())
                .primaryWallet(dto.getPrimaryWallet())
                .balances(dto.getBalances())
                .build();
    }

}
