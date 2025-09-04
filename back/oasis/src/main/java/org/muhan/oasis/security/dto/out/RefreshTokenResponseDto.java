package org.muhan.oasis.security.dto.out;

import lombok.Builder;
import lombok.Getter;
import org.muhan.oasis.security.entity.RefreshTokenEntity;

import java.util.Date;

@Getter
@Builder
public class RefreshTokenResponseDto {
    private String userUuid;
    private String token;
    private Date expiresAt;

    public static RefreshTokenResponseDto from(RefreshTokenEntity entity){
        return RefreshTokenResponseDto.builder()
                .userUuid(entity.getUserUuid())
                .token(entity.getToken())
                .expiresAt(entity.getExpiresAt())
                .build();
    }
}
