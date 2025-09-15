package org.muhan.oasis.reservation.dto.in;

import lombok.Builder;
import lombok.Data;
import org.muhan.oasis.reservation.vo.in.RegistReservationRequestVo;

@Data
@Builder
public class ApproveRequestDto {
    private String userUUID;
    private String amountUSDC;  // "100.00" (소수점 2자리까지)
    private String feeUSDC;

    public static ApproveRequestDto from(RegistReservationRequestVo dto, String userUUID) {
        return ApproveRequestDto.builder()
                .userUUID(userUUID)
                .amountUSDC(String.valueOf(dto.getPayment()))
                .feeUSDC("0") //수수료
                .build();
    }
}
