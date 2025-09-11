package org.muhan.oasis.openAI.dto.in;

public record MessageDto (
    String userNickname,
    Object data
){}