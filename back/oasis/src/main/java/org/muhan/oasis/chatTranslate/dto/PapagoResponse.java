package org.muhan.oasis.chatTranslate.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
@JsonIgnoreProperties(ignoreUnknown = true)
public record PapagoResponse(Message message) {
    @JsonIgnoreProperties(ignoreUnknown = true)
    public record Message(Result result) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record Result(
            String translatedText,
            String srcLangType,
            String tarLangType
    ) {}
}