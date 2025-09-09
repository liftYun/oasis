package org.muhan.oasis.security.vo.in;

import lombok.Builder;
import lombok.Setter;

@Setter
@Builder
public class IssueRefreshTokenVo {
    private int id;
    private String uuid;
    private String token;
}
