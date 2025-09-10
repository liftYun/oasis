package org.muhan.oasis.wallet.dto;

import lombok.Data;
import java.util.UUID;

@Data
public class CreateWalletRequest {
    private UUID userId;
}