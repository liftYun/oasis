package org.muhan.oasis.security.vo.out;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class RefreshTokenCheckVo {
    private int id;
    private String uuid;
    private String token;
}
