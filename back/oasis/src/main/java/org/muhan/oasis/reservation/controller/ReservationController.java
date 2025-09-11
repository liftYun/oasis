package org.muhan.oasis.reservation.controller;

import io.swagger.v3.oas.annotations.Operation;
import lombok.extern.log4j.Log4j2;
import org.muhan.oasis.common.base.BaseResponse;
import org.muhan.oasis.reservation.dto.in.RegistReservationRequestDto;
import org.muhan.oasis.reservation.service.ReservationService;
import org.muhan.oasis.reservation.vo.in.RegistReservationRequestVo;
import org.muhan.oasis.security.dto.out.CustomUserDetails;
import org.muhan.oasis.user.entity.UserEntity;
import org.muhan.oasis.user.service.UserService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import static org.muhan.oasis.common.base.BaseResponseStatus.FAIL_REGIST_RESERVATION;

@RestController
@ResponseBody
@Log4j2
@RequestMapping("/api/v1/reservation")
public class ReservationController {
    private final ReservationService reservationService;

    public ReservationController(ReservationService reservationService) {
        this.reservationService = reservationService;
    }

    @Operation(
            summary = "예약 등록",
            description = """
                결제 외에 예약 정보 자체만을 DB에 등록합니다
                """,
            tags = {"예약"}
    )
    @PostMapping
    public BaseResponse<?> registReservation(
            @AuthenticationPrincipal CustomUserDetails customUserDetails,
            @RequestBody RegistReservationRequestVo vo
    ) {
        Long userId = customUserDetails.getUserId();
        String result = reservationService.registReserVation(userId, RegistReservationRequestDto.from(userId, vo));

        if(result.isEmpty()) return BaseResponse.error(FAIL_REGIST_RESERVATION);

        return BaseResponse.of(result);
    }
}
