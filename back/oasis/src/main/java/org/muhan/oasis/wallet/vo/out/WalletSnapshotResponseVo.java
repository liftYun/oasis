package org.muhan.oasis.wallet.vo.out;

import lombok.Builder;
import lombok.Data;
import org.muhan.oasis.wallet.dto.out.WalletInfoResponseDto;

import java.util.List;
import java.util.Map;

@Data
@Builder
public class WalletSnapshotResponseVo {
    private WalletInfoResponseDto primaryWallet; // static 제거!!
    private List<WalletInfoResponseDto> wallets;
    private Map<String, String> balances;
}
