package org.muhan.oasis.security.vo.out;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AccessTokenResponseVo {
    private String tokenType;     // "Bearer"
    private String accessToken;   // 실제 AT
    private long   expiresInMs;   // 남은 만료(ms)
}
