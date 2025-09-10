package org.muhan.oasis.wallet.controller;


import lombok.RequiredArgsConstructor;
import org.muhan.oasis.wallet.dto.CircleSdkInitData;
import org.muhan.oasis.wallet.dto.CreateWalletRequest;
import org.muhan.oasis.wallet.service.CircleApiService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/v1/wallets")
@RequiredArgsConstructor
// React 개발 서버(localhost:3000)에서의 요청을 허용하기 위한 CORS 설정
//@CrossOrigin(origins = "${cors.allowed-origins}")
public class WalletController {

    private final CircleApiService circleApiService;

    @PostMapping("/create")
    public Mono<CircleSdkInitData> createWallet(@RequestBody CreateWalletRequest request) {
        return circleApiService.createAndInitializeWallet(request.getUserId());
    }
}
