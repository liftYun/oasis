package org.muhan.oasis.reservation.vo.out;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record ReservedDayResponseVo(
    @JsonFormat(pattern = "yyyy-MM-dd")
    LocalDate checkinDate,

    @JsonFormat(pattern = "yyyy-MM-dd")
    LocalDate checkoutDate
){
    public static ReservedDayResponseVo of(LocalDateTime in, LocalDateTime out) {
        return new ReservedDayResponseVo(
                in != null ? in.toLocalDate() : null,
                out != null ? out.toLocalDate() : null
        );
    }

}