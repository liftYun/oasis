package org.muhan.oasis.wallet.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;
import java.util.Map;

@Builder @Data
public class CircleSdkInitData {
    private String appId;
    private String userToken;
    private String encryptionKey;

    // 신규일 때만 내려오는 값 (PIN/초기화 실행용)
    private String challengeId; // null이면 기존 사용자 플로우

    // 기존일 때 바로 쓸 수 있는 값들
    private List<WalletInfo> wallets;     // 여러 개일 수 있어 목록
    private WalletInfo primaryWallet;     // 기본으로 쓸 하나
    private Map<String, String> balances; // 예: { "USDC": "10.0" }
}
