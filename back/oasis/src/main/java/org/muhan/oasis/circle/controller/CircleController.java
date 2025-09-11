//package org.muhan.oasis.circle.controller;


import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
//import org.muhan.oasis.circle.service.CircleService;
import org.muhan.oasis.circle.vo.CreateWalletRequest;
//import org.springframework.http.*;
//import org.springframework.web.bind.annotation.*;
//
//@RestController
//@RequestMapping("/api/circle")
//@RequiredArgsConstructor
//public class CircleController {
//
//    private final CircleService circleService;
//
//    @PostMapping("/wallets")
//    public ResponseEntity<?> createWallet(@Valid @RequestBody CreateWalletRequest req) {
//        try {
//            var resp = circleService.createWallet(req);
//            return ResponseEntity.status(HttpStatus.CREATED).body(resp);
//        } catch (CircleService.CircleUpstreamException e) {
//            return ResponseEntity.status(e.getStatus()).body(e.getBody());
//        }
//    }
//
//    @GetMapping("/wallets/{id}")
//    public ResponseEntity<?> getWallet(@PathVariable String id) {
//        try {
//            var resp = circleService.getWallet(id);
//            return ResponseEntity.ok(resp);
//        } catch (CircleService.CircleUpstreamException e) {
//            return ResponseEntity.status(e.getStatus()).body(e.getBody());
//        }
//    }

//    @GetMapping("/wallets/{id}/balances")
//    public ResponseEntity<?> getBalances(@PathVariable String id) {
//        try {
//            var resp = circleService.getBalances(id);
//            return ResponseEntity.ok(resp);
//        } catch (CircleService.CircleUpstreamException e) {
//            return ResponseEntity.status(e.getStatus()).body(e.getBody());
//        }
//    }

//    @PostMapping("/payments/initialize")
//    public ResponseEntity<?> initializePayment(@RequestBody PaymentInitRequest req) {
//        try {
//            var resp = circleService.initializePayment(req);
//            return ResponseEntity.ok(resp);
//        } catch (Exception e) {
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
//        }
//    }

//    @PostMapping("/wallets/{id}")
//    public ResponseEntity<?> buyUsdc() {
//        try {
//            var resp = circleService.buyUsdc();
//            return ResponseEntity.ok(resp);
//        } catch (CircleService.CircleUpstreamException e) {
//            return ResponseEntity.status(e.getStatus()).body(e.getBody());
//        }
//    }
//
//}