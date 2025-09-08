package org.muhan.oasis.user.vo.out;

import org.muhan.oasis.user.entity.UserEntity;

public record UserBriefResponseVo (Long id, String nickname, String profileImageUrl) {
    public static UserBriefResponseVo from(UserEntity e) {
        return new UserBriefResponseVo(e.getUserId(), e.getNickname(), e.getProfileImg());
    }
}
