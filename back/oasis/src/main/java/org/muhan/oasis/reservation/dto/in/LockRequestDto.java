package org.muhan.oasis.reservation.dto.in;

import lombok.Data;
import org.muhan.oasis.reservation.vo.in.RegistReservationRequestVo;

import java.time.ZoneId;

@Data
public class LockRequestDto {
    private String userUUID;
    private Long stayId;
//    private String host;       // host address
    private String amountUSDC; // "100.00"
    private String feeUSDC;    // "3.00"
    private long checkIn;      // unix sec
    private long checkOut;     // unix sec
    private String reservationId;      // optional (0x...32)

    // ✅ 정적 팩토리 메서드
    public static LockRequestDto from(RegistReservationRequestVo vo, String userUUID) {
        LockRequestDto dto = new LockRequestDto();
        dto.setUserUUID(userUUID);
//        dto.setWalletId(walletId);
        dto.setStayId(vo.getStayId());
//        dto.setHost(vo.getHostAddress());
        dto.setAmountUSDC(String.valueOf(vo.getPayment()));
        dto.setFeeUSDC("0");
        dto.setCheckIn(vo.getCheckinDate().atZone(ZoneId.systemDefault()).toEpochSecond());
        dto.setCheckOut(vo.getCheckoutDate().atZone(ZoneId.systemDefault()).toEpochSecond());
        dto.setReservationId(vo.getReservationId());
        return dto;
    }

}
