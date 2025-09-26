package org.muhan.oasis.user.vo.out;

import org.muhan.oasis.user.entity.UserEntity;

import java.util.List;

public record UserSearchResultResponseVo (
        List<UserBriefResponseVo> content,
        int page,
        int size,
        long totalElements,
        int totalPages
) {}
