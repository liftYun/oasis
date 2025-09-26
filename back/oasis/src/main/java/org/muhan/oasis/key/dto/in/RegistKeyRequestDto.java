package org.muhan.oasis.key.dto.in;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.ToString;
import org.muhan.oasis.stay.entity.DeviceEntity;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
@Builder
@ToString
public class RegistKeyRequestDto {
    private DeviceEntity device;
    private LocalDateTime activationTime;
    private LocalDateTime expireTime;
}
