package org.muhan.oasis.wallet.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
@Builder
public class WalletSnapshot {
    private WalletInfo primaryWallet;          // 대표 지갑
    private List<WalletInfo> wallets;          // 전체 지갑 목록
    private Map<String, String> balances;      // 예: {"USDC":"10"} (원하면 전토큰 확장)
}
