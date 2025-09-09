package org.muhan.oasis.stay.controller;

import lombok.RequiredArgsConstructor;
import org.muhan.oasis.common.base.BaseResponse;
import org.muhan.oasis.stay.dto.in.CreateStayRequestDTO;
import org.muhan.oasis.stay.service.StayService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/stay")
public class StayController {

    private StayService stayService;

    @PostMapping
    public BaseResponse<Void> createStay(CreateStayRequestDTO stayRequest){
        return BaseResponse.ok();
    }
}
