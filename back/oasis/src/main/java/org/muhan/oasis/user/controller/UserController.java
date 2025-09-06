package org.muhan.oasis.user.controller;

import lombok.extern.log4j.Log4j2;
import org.muhan.oasis.common.base.BaseResponse;
import org.muhan.oasis.security.dto.out.CustomUserDetails;
import org.muhan.oasis.user.entity.UserEntity;
import org.muhan.oasis.user.service.UserService;
import org.muhan.oasis.user.vo.out.UserDetailsResponseVo;
import org.muhan.oasis.user.vo.out.UserSearchResultResponseVo;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@ResponseBody
@Log4j2
@RequestMapping("/api/v1/user")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    /**
     * 오토컴플리트 검색
     * 예: GET /api/v1/users/search?q=이도&page=0&size=10&exclude=1&exclude=2
     */
    @GetMapping("/search")
    public BaseResponse<UserSearchResultResponseVo> search(
            @RequestParam("q") String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(value = "exclude", required = false) List<Long> excludeIds
    ) {
        UserSearchResultResponseVo result = userService.autocomplete(keyword, page, size, excludeIds);
        return BaseResponse.of(result);
    }

    /**
     * 정확 매칭이 필요한 경우
     * 예: GET /api/v1/users/by-nickname/이도윤
     */
    @GetMapping("/by-nickname/{nickname}")
    public BaseResponse<Long> getByNickname(@PathVariable String nickname) {
        Long userId = userService.getUserIdByExactNickname(nickname);
        return BaseResponse.of(userId);
    }

    @PostMapping("/mypage")
    public BaseResponse<?> mypage(@AuthenticationPrincipal CustomUserDetails userDetails) {
        return BaseResponse.of(UserDetailsResponseVo.from(userService.getUser(userDetails.getUserId())));
    }
}
