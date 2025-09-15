package org.muhan.oasis.wallet.controller;


import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.muhan.oasis.common.base.BaseResponse;
import org.muhan.oasis.common.base.BaseResponseStatus;
import org.muhan.oasis.security.dto.out.CustomUserDetails;
import org.muhan.oasis.wallet.dto.circle.out.WalletSnapshotResponseDto;
import org.muhan.oasis.wallet.service.WalletService;
import org.muhan.oasis.wallet.vo.out.InitWalletResponseVo;
import org.muhan.oasis.wallet.vo.out.WalletSnapshotResponseVo;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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

    //프론트에서 지갑 생성 직후 DB저장 필요
    @GetMapping("/snapshot")
    public BaseResponse<?> refreshWallet(@AuthenticationPrincipal CustomUserDetails user) {
        try {
            WalletSnapshotResponseDto snapshot = walletService.getWalletSync(user.getUserUuid());
            walletService.saveWalletIfNew(user.getUserUuid(), snapshot.getPrimaryWallet());
            return BaseResponse.of(snapshot);
        } catch (Exception e) {
            log.error("지갑 스냅샷 조회 실패", e);
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
