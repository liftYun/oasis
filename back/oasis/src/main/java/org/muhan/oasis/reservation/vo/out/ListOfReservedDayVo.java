package org.muhan.oasis.reservation.vo.out;

import java.util.List;

public record ListOfReservedDayVo(
        int totalCount,
        List<ReservedDayVo> reservations
) {
    public static ListOfReservedDayVo of(List<ReservedDayVo> list) {
        return new ListOfReservedDayVo(list != null ? list.size() : 0, list);
    }
}
