package org.muhan.oasis.reservation.dto.in;

import lombok.Data;
import org.muhan.oasis.reservation.vo.in.RegistReservationRequestVo;

import java.math.BigDecimal;
import java.time.ZoneId;

@Data
public class LockRequestDto {
    private String userUUID;
    private Long stayId;
    private BigDecimal amountUSDC; // "100.00"
    private BigDecimal feeUSDC;    // "3.00"
    private long checkIn;      // unix sec
    private long checkOut;     // unix sec
    private String reservationId;      // optional (0x...32)

    public static LockRequestDto from(RegistReservationRequestVo vo, String userUUID) {
        LockRequestDto dto = new LockRequestDto();
        dto.setUserUUID(userUUID);
        dto.setStayId(vo.getStayId());
        dto.setAmountUSDC(BigDecimal.valueOf(vo.getPayment()));
        dto.setFeeUSDC(BigDecimal.ZERO);
        dto.setCheckIn(vo.getCheckinDate().atZone(ZoneId.systemDefault()).toEpochSecond());
        dto.setCheckOut(vo.getCheckoutDate().atZone(ZoneId.systemDefault()).toEpochSecond());
        dto.setReservationId(vo.getReservationId());
        return dto;
    }

}
