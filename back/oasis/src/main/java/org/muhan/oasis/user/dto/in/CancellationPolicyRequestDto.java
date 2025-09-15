package org.muhan.oasis.user.dto.in;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import org.muhan.oasis.user.vo.in.CancellationPolicyRequestVo;

@Setter
@Getter
@AllArgsConstructor
@Builder
public class CancellationPolicyRequestDto {
    private Integer policy1;
    // 3일
    private Integer policy2;
    // 5일
    private Integer policy3;
    // 7알
    private Integer policy4;
    public static CancellationPolicyRequestDto from(CancellationPolicyRequestVo vo) {
        return CancellationPolicyRequestDto.builder()
                .policy1(vo.getPolicy1())
                .policy2(vo.getPolicy2())
                .policy3(vo.getPolicy3())
                .policy4(vo.getPolicy4())
                .build();
    }
}
