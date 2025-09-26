package org.muhan.oasis.openAI.dto.out;

public record SseSendRequestDto(
        String eventName,
        Object data
) {
}
