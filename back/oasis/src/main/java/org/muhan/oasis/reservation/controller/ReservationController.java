package org.muhan.oasis.reservation.controller;

import io.swagger.v3.oas.annotations.Operation;
import lombok.extern.log4j.Log4j2;
import org.muhan.oasis.common.base.BaseResponse;
import org.muhan.oasis.reservation.dto.in.ApproveRequestDto;
import org.muhan.oasis.reservation.dto.in.LockRequestDto;
import org.muhan.oasis.reservation.dto.in.RegistReservationRequestDto;
import org.muhan.oasis.reservation.service.ApproveService;
import org.muhan.oasis.reservation.service.LockService;
import org.muhan.oasis.reservation.service.ReservationService;
import org.muhan.oasis.reservation.vo.in.CancelReservationRequestVo;
import org.muhan.oasis.reservation.vo.in.RegistReservationRequestVo;
import org.muhan.oasis.reservation.vo.out.CancelReservationResponseVo;
import org.muhan.oasis.reservation.vo.out.ListOfReservationResponseVo;
import org.muhan.oasis.reservation.vo.out.ReservationDetailsResponseVo;
import org.muhan.oasis.security.dto.out.CustomUserDetails;
import org.muhan.oasis.user.service.UserService;
import org.muhan.oasis.valueobject.Language;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import static org.muhan.oasis.common.base.BaseResponseStatus.FAIL_REGIST_RESERVATION;

@RestController
@ResponseBody
@Log4j2
@RequestMapping("/api/v1/reservation")
public class ReservationController {
    private final ReservationService reservationService;
    private final UserService userService;

    private final LockService lockService;
    private final ApproveService approveService;



    public ReservationController(ReservationService reservationService, UserService userService, LockService lockService, ApproveService approveService) {
        this.reservationService = reservationService;
        this.userService = userService;
        this.lockService = lockService;
        this.approveService = approveService;
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
        Long userId = userService.getUserIdByUserUuid(customUserDetails.getUserUuid());

        // DB에 예약 등록
        String resId  = reservationService.registReserVation(userId, RegistReservationRequestDto.from(vo));

        if(resId.isEmpty()) return BaseResponse.error(FAIL_REGIST_RESERVATION);

        return BaseResponse.of(resId);
    }

    /**
     * 온체인 Approve 트랜잭션 생성
     */
    @Operation(summary = "Approve 트랜잭션 생성", tags = {"예약"})
    @PostMapping("/approve")
    public BaseResponse<?> createApprove(
            @AuthenticationPrincipal CustomUserDetails customUserDetails,
            @RequestBody RegistReservationRequestVo vo
    ) {
        ApproveService.Result approve = approveService.createApprove(
                ApproveRequestDto.from(vo, customUserDetails.getUserUuid())
        );
        return BaseResponse.of(approve);
    }

    /**
     * 온체인 Lock 트랜잭션 생성
     */
    @Operation(summary = "Lock 트랜잭션 생성", tags = {"예약"})
    @PostMapping("/lock")
    public BaseResponse<?> createLock(
            @AuthenticationPrincipal CustomUserDetails customUserDetails,
            @RequestBody RegistReservationRequestVo vo
    ) {
        LockService.Result lock = lockService.createLock(
                LockRequestDto.from(vo, customUserDetails.getUserUuid())
        );
        return BaseResponse.of(lock);
    }

    @Operation(
            summary = "예약 내역 리스트",
            description = """
                등록 된 예약 정보를 불러옵니다.
                """,
            tags = {"예약"}
    )
    @GetMapping("/list")
    public BaseResponse<ListOfReservationResponseVo> getListOfReservation(@AuthenticationPrincipal CustomUserDetails customUserDetails) {
        Long userId = userService.getUserIdByUserUuid(customUserDetails.getUserUuid());
        return BaseResponse.of(reservationService.getListOfReservation(userId));
    }

    @Operation(
            summary = "숙소 별 예약 일자 리스트",
            description = """
                숙소 별로 예약 된 일자를 불러옵니다.
                """,
            tags = {"예약"}
    )
    @PreAuthorize("hasRole('ROLE_HOST')")
    @GetMapping("/host/{stayId}")
    public BaseResponse<?> getFutureReservedDays(
            @AuthenticationPrincipal CustomUserDetails customUserDetails,
            @PathVariable Long stayId
            ) {
        Long userId = userService.getUserIdByUserUuid(customUserDetails.getUserUuid());
        return BaseResponse.of(reservationService.getListOfReservedDay(userId, stayId));
    }

    @Operation(
            summary = "예약 상세 내용 조회",
            description = """
                reservationId로 해당 예약에 대한 상세 내용을 불러옵니다.
                """,
            tags = {"예약"}
    )
    @GetMapping("/details/{reservationId}")
    public BaseResponse<ReservationDetailsResponseVo> getReservationDetails(
            @AuthenticationPrincipal CustomUserDetails customUserDetails,
            @PathVariable String reservationId
    ){
        Long userId = userService.getUserIdByUserUuid(customUserDetails.getUserUuid());
        Language language = customUserDetails.getLanguage();
        return BaseResponse.of(ReservationDetailsResponseVo.fromDto(reservationService.getReservationDetails(userId, language, reservationId)));
    }

    @Operation(
            summary = "예약 취소",
            description = """
                reservationId로 해당 예약을 취소합니다.
                """,
            tags = {"예약"}
    )
    @PostMapping("/cancel/{reservationId}")
    public BaseResponse<CancelReservationResponseVo> cancelReservation(@AuthenticationPrincipal CustomUserDetails customUserDetails, @PathVariable String reservationId,
                                                                       @RequestBody CancelReservationRequestVo vo) {
        String challengeId = reservationService.cancelReservation(
                customUserDetails.getUserUuid(), reservationId, vo.getIdempotencyKey()
        ).getChallengeId();

        return BaseResponse.of(new CancelReservationResponseVo(challengeId));
    }
}
