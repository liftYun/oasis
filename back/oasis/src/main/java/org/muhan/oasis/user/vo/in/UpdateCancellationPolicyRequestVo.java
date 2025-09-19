package org.muhan.oasis.user.vo.in;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import org.muhan.oasis.user.dto.in.UpdateCancellationPolicyRequestDto;

@Setter
@Getter
@AllArgsConstructor
@Builder
public class UpdateCancellationPolicyRequestVo {
    private Integer policy1;
    // 3일
    private Integer policy2;
    // 5일
    private Integer policy3;
    // 7알
    private Integer policy4;

    public static UpdateCancellationPolicyRequestVo from(UpdateCancellationPolicyRequestDto dto) {
        return UpdateCancellationPolicyRequestVo.builder()
                .policy1(dto.getPolicy1())
                .policy2(dto.getPolicy2())
                .policy3(dto.getPolicy3())
                .policy4(dto.getPolicy4())
                .build();
    }
}
