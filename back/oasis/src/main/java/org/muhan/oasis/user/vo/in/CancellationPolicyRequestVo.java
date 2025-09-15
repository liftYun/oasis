package org.muhan.oasis.user.vo.in;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import org.muhan.oasis.user.dto.in.CancellationPolicyRequestDto;

@Setter
@Getter
@AllArgsConstructor
@Builder
public class CancellationPolicyRequestVo {
    private Integer policy1;
    // 3일
    private Integer policy2;
    // 5일
    private Integer policy3;
    // 7알
    private Integer policy4;

    public static CancellationPolicyRequestVo from(CancellationPolicyRequestDto dto) {
        return CancellationPolicyRequestVo.builder()
                .policy1(dto.getPolicy1())
                .policy2(dto.getPolicy2())
                .policy3(dto.getPolicy3())
                .policy4(dto.getPolicy4())
                .build();
    }
}
