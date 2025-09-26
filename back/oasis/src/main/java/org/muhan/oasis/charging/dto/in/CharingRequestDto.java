package org.muhan.oasis.charging.dto.in;

import lombok.Builder;
import lombok.Data;
import org.muhan.oasis.charging.vo.in.ChargingRequestVo;
import org.muhan.oasis.user.entity.UserEntity;

import java.math.BigDecimal;

@Data
@Builder
public class CharingRequestDto {
    private BigDecimal usdc;
    private String userUUID;

    public static CharingRequestDto from(ChargingRequestVo vo, String userUUID) {
        return CharingRequestDto.builder()
                .usdc(BigDecimal.valueOf(vo.getPayment()))
                .userUUID(userUUID)
                .build();
    }
}
