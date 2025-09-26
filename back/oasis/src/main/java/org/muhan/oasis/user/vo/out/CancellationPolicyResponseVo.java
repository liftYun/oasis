package org.muhan.oasis.user.vo.out;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Builder
@Setter
@Getter
public class CancellationPolicyResponseVo {
    private Long id;

    private Integer policy1;

    private Integer policy2;

    private Integer policy3;

    private Integer policy4;
}
