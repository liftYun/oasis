package org.muhan.oasis.stay.dto.out;

import java.net.URL;

public record PresignedResponseDto(
        Long sortOrder,
        String key,
        URL uploadUrl,
        String publicUrl
) {
}
