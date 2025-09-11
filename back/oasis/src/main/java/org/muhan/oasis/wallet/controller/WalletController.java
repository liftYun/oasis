package org.muhan.oasis.wallet.controller;


import lombok.RequiredArgsConstructor;
import org.muhan.oasis.wallet.dto.CircleSdkInitData;
import org.muhan.oasis.wallet.dto.CreateWalletRequest;
import org.muhan.oasis.wallet.service.WalletApiService;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/wallets")
@RequiredArgsConstructor
// React 개발 서버(localhost:3000)에서의 요청을 허용하기 위한 CORS 설정
//@CrossOrigin(origins = "${cors.allowed-origins}")
public class WalletController {

    private final WalletApiService circleApiService;

    @PostMapping("/init-session")
    public Mono<CircleSdkInitData> createWallet(@RequestBody CreateWalletRequest request) {
        return circleApiService.createAndInitializeWallet(request.getUserId());
    }

    @GetMapping
    public Mono<org.muhan.oasis.wallet.dto.WalletSnapshot> getAddress(@RequestParam("userId") UUID userId) {
        // 테스트 단계: 최근 init-session에서 선정된 primary 주소 반환
        return circleApiService.getWallet(userId);
    }
}
