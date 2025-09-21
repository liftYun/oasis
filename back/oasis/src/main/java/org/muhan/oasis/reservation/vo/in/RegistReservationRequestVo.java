package org.muhan.oasis.reservation.vo.in;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
@NoArgsConstructor // Jackson 역직렬화용 기본 생성자
public class RegistReservationRequestVo {

    @NotBlank(message = "예약 ID는 필수입니다.")
    private String reservationId;

    @NotNull(message = "숙소 ID는 필수입니다.")
    @Positive(message = "숙소 ID는 양수여야 합니다.")
    private Long stayId;

    @NotNull(message = "체크인 날짜는 필수입니다.")
    private LocalDateTime checkinDate;

    @NotNull(message = "체크아웃 날짜는 필수입니다.")
    private LocalDateTime checkoutDate;

    @NotNull(message = "예약 생성일은 필수입니다.")
    private LocalDateTime reservationDate;

    @NotNull(message = "결제 금액은 필수입니다.")
    @Positive(message = "결제 금액은 0보다 커야 합니다.")
    private Integer payment;
}
