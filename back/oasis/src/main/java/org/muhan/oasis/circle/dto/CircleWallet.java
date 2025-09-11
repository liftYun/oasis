package org.muhan.oasis.circle.dto;


import lombok.*;

import java.time.OffsetDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CircleWallet {
    private String id;
    private String walletSetId;
    private String custodyType;
    private String userId;
    private String state; // e.g., "LIVE"
    private String createDate;
    private String updateDate;
    // 필요한 필드 추가
}
