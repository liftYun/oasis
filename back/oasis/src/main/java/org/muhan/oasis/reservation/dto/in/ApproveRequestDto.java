package org.muhan.oasis.reservation.dto.in;

import lombok.Builder;
import lombok.Data;
import org.muhan.oasis.reservation.vo.in.RegistReservationRequestVo;

import java.math.BigDecimal;

@Data
@Builder
public class ApproveRequestDto {
    private String userUUID;
    private BigDecimal amountUSDC;  // "100.00" (소수점 2자리까지)
    private BigDecimal feeUSDC;
    private String reservationId;

    public static ApproveRequestDto from(RegistReservationRequestVo vo, String userUUID) {
        return ApproveRequestDto.builder()
                .userUUID(userUUID)
                .amountUSDC(BigDecimal.valueOf(vo.getPayment()))
                .feeUSDC(BigDecimal.ZERO) //수수료
                .reservationId(vo.getReservationId())
                .build();
    }
}
