package org.muhan.oasis.key.vo.in;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Builder;
import lombok.Getter;
import org.muhan.oasis.key.dto.in.ShareKeyRequestDto;

import java.util.List;

@Getter
@Builder
public class ShareKeyRequestVo {
    // 예약 번호
    private String reservationId;
    // 공유할 유저 이름들
    private List<String> userNicknames;

    public ShareKeyRequestDto toDto() {
        return ShareKeyRequestDto.builder()
                .reservationId(this.reservationId)
                .userNicknames(this.userNicknames)
                .build();
    }
}
