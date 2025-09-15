package org.muhan.oasis.wish.controller;

import lombok.RequiredArgsConstructor;
import org.muhan.oasis.common.base.BaseResponse;
import org.muhan.oasis.security.dto.out.CustomUserDetails;
import org.muhan.oasis.wish.dto.in.CreateWishRequestDto;
import org.muhan.oasis.wish.service.WishService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.net.URI;

import static org.muhan.oasis.common.base.BaseResponseStatus.CREATED;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/wish")
public class WishController {

    private final WishService wishService;

    @PostMapping
    public ResponseEntity<BaseResponse<?>> addWish(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestBody CreateWishRequestDto wishRequestDto
            ){

        wishService.addWish(userDetails.getUserUuid(), wishRequestDto);

        URI location = URI.create("/api/v1/wish");

        BaseResponse<Void> body = new BaseResponse<>(
                CREATED.getHttpStatusCode(),
                CREATED.isSuccess(),
                CREATED.getMessage(),
                CREATED.getCode(),
                null
        );

        return ResponseEntity.status(HttpStatus.CREATED)
                .location(location)
                .body(body);

    }


}
