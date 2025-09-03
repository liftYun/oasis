//package org.muhan.oasis.security.controller;
//
//import org.muhan.oasis.security.dto.in.RegistRequestDto;
//import org.muhan.oasis.security.service.JoinService;
//import org.springframework.web.bind.annotation.PutMapping;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.ResponseBody;
//import org.springframework.web.bind.annotation.RestController;
//
//@RestController
//@ResponseBody
//@RequestMapping("/api/v1")
//public class JoinController {
//
//    private final JoinService joinService;
//
//    public JoinController(JoinService joinService) {
//
//        this.joinService = joinService;
//    }
//
//    @PutMapping("/join")
//    public String joinProcess(RegistRequestDto registRequestDto) {
//
//        joinService.joinProcess(registRequestDto);
//
//        return "ok";
//    }
//}
