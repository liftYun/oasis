package org.muhan.oasis.key.dto.in;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

import java.util.List;

@Getter
@AllArgsConstructor
@Builder
@ToString
public class ShareKeyRequestDto {
    private Long reservationId;

    private List<String> userNicknames;
}
