package org.muhan.oasis.wallet.vo.in;

import lombok.Data;

import java.util.UUID;

@Data
public class InitWalletRequestVo {
    private UUID userId;
}