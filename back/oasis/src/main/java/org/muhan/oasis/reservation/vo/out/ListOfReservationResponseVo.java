package org.muhan.oasis.reservation.vo.out;

import lombok.Builder;
import org.muhan.oasis.reservation.dto.out.ReservationResponseDto;

import java.util.List;

@Builder
public class ListOfReservationResponseVo {
    private final List<ReservationResponseDto> reservations;

    public static ListOfReservationResponseVo of(List<ReservationResponseDto> list) {
        return ListOfReservationResponseVo.builder()
                .reservations(list)
                .build();
    }
}
