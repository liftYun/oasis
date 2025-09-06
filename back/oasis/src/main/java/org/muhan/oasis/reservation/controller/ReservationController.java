package org.muhan.oasis.reservation.controller;

import lombok.RequiredArgsConstructor;
import org.muhan.oasis.reservation.dto.out.BookingResponse;
import org.muhan.oasis.reservation.service.ReservationService;
import org.muhan.oasis.reservation.vo.in.ExecuteReservationRequestVo;
import org.muhan.oasis.reservation.vo.in.RecordReservationRequest;
import org.muhan.oasis.reservation.vo.out.BookingResponseVo;
import org.muhan.oasis.web3.service.Web3Service;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/reservations")
@RequiredArgsConstructor
public class ReservationController {

    private final ReservationService reservationService;
    private final Web3Service web3Service;

//    @PostMapping("/execute")
//    public ResponseEntity<?> executePermitReservation(@RequestBody ExecuteReservationRequestVo request) {
//        reservationService.executeReservation(request);
//        return ResponseEntity.ok().build();
//    }

    @PostMapping("/record")
    public ResponseEntity<BookingResponseVo> record(@RequestBody RecordReservationRequest req) {
        BookingResponseVo res = reservationService.recordOnchainReservation(req);
        return ResponseEntity.ok(res);
    }

    @GetMapping("/{resId}")
    public ResponseEntity<?> getBooking(@PathVariable String resId) {
        try {
            BookingResponse r = web3Service.getOnchainBooking(resId, null);
            if (r == null) return ResponseEntity.notFound().build();
            return ResponseEntity.ok(r);
        } catch (IllegalArgumentException bad) {
            return ResponseEntity.badRequest().body(bad.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("ERROR: " + e.getMessage());
        }
    }
}