package org.muhan.oasis.reservation.vo.out;

import com.fasterxml.jackson.annotation.JsonFormat;
import org.muhan.oasis.reservation.entity.ReservationEntity;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record ReservedDayVo(
    @JsonFormat(pattern = "yyyy-MM-dd")
    LocalDate checkinDate,

    @JsonFormat(pattern = "yyyy-MM-dd")
    LocalDate checkoutDate
){
    public static ReservedDayVo of(LocalDateTime in, LocalDateTime out) {
        return new ReservedDayVo(
                in != null ? in.toLocalDate() : null,
                out != null ? out.toLocalDate() : null
        );
    }

}