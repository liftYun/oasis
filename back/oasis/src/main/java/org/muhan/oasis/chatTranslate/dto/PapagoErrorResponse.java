package org.muhan.oasis.chatTranslate.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public record PapagoErrorResponse(
        String errorCode,
        String errorMessage
) {}
