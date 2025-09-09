package org.muhan.oasis.stay.controller;

import lombok.RequiredArgsConstructor;
import org.muhan.oasis.common.base.BaseResponse;
import org.muhan.oasis.security.dto.out.CustomUserDetails;
import org.muhan.oasis.stay.dto.in.CreateStayRequestDto;
import org.muhan.oasis.stay.service.StayService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/stay")
public class StayController {

    private StayService stayService;

    // 숙소 등록 + 도어락 등록
    @PostMapping
    public BaseResponse<Void> createStay(
            CreateStayRequestDto stayRequest,
            @AuthenticationPrincipal CustomUserDetails userDetails){

        stayService.registStay(stayRequest, userDetails.getUserId());

        return BaseResponse.ok();
    }

    // 숙소 수정

    // 숙소 삭제

    // 숙소 상세글 조회

    // 숙소 사진 업로드 (여러장)

    // 숙소 검색

}
