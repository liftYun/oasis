package org.muhan.oasis.booking.controller;

import lombok.RequiredArgsConstructor;
import org.muhan.oasis.booking.dto.LockRequest;
import org.muhan.oasis.booking.dto.LockResponse;
import org.muhan.oasis.booking.service.BookingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/booking")
public class BookingController {

    private final BookingService bookingService;

    @PostMapping("/lock")
    public ResponseEntity<?> lock(@RequestBody LockRequest req) {
        try {
            LockResponse resp = bookingService.createApproveThenLock(req);
            return ResponseEntity.ok(resp);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(err(400, "validation error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(err(500, "circle create transaction failed", e.getMessage()));
        }
    }

    private static ErrorBody err(int status, String message, Object result) {
        return new ErrorBody(status, message, result);
    }
    record ErrorBody(int status, String message, Object result) {}
}