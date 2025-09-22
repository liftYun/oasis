package org.muhan.oasis.openAI.dto.in;

import org.muhan.oasis.valueobject.MessageType;

import java.time.Instant;
import java.util.Map;

public record MessageEnvelope<T> (
        String id,
        MessageType type,
        int version,
        String correlationId,
        Map<String, String> meta,
        T payload
){}