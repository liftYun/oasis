package org.muhan.oasis.stay.dto.out;

import lombok.Builder;
import org.muhan.oasis.user.entity.UserEntity;

@Builder
public record HostInfoResponseDto (String nickname, String uuid, String url){
    public static HostInfoResponseDto from(UserEntity user){
        return HostInfoResponseDto.builder()
                .nickname(user.getNickname())
                .uuid(user.getUserUuid())
                .url(user.getProfileUrl())
                .build();
    }
}
