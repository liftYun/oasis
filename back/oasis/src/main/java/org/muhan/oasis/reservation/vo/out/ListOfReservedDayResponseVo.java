package org.muhan.oasis.reservation.vo.out;

import java.util.List;

public record ListOfReservedDayResponseVo(
        int totalCount,
        List<ReservedDayResponseVo> reservations
) {
    public static ListOfReservedDayResponseVo of(List<ReservedDayResponseVo> list) {
        return new ListOfReservedDayResponseVo(list != null ? list.size() : 0, list);
    }
}
