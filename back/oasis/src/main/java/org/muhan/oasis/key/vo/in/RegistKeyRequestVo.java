package org.muhan.oasis.key.vo.in;

import lombok.Builder;
import lombok.Getter;
import org.muhan.oasis.key.dto.in.RegistKeyRequestDto;
import org.muhan.oasis.stay.entity.DeviceEntity;

import java.time.LocalDateTime;

@Getter
public class RegistKeyRequestVo {
    private DeviceEntity device;
    private LocalDateTime activationTime;
    private LocalDateTime expireTime;

    @Builder
    public RegistKeyRequestDto toDto() {
        if (activationTime == null) {activationTime = LocalDateTime.now();}

        return RegistKeyRequestDto.builder()
                .device(this.device)
                .activationTime(this.activationTime)
                .expireTime(this.expireTime)
                .build();
    }
}
