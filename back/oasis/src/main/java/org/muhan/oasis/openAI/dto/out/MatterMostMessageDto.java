package org.muhan.oasis.openAI.dto.out;


import java.util.Map;

public record MatterMostMessageDto (
        String queue,                 // DLQ 이름
        String sqsMessageId,          // SQS MessageId
        String receiveCount,         // ApproximateReceiveCount
        String envelopeId,            // env.id()
        String type,                  // env.type()
        Integer version,              // env.version()
        String correlationId,         // env.correlationId()
        Map<String, String> meta,     // env.meta()
        String payloadJson           // payload 요약(JSON)
){
    public String toMattermostText() {
        return """
        :rotating_light: *DLQ 감지*
        • queue: %s
        • sqsMessageId: %s
        • receiveCount: %s
        • envelopeId: %s
        • type/version: %s / %s
        • correlationId: %s
        • meta: ```json
        %s
        ```
        • payload: ```json
        %s
        ```
        """.formatted(
                queue, sqsMessageId, receiveCount,
                envelopeId, type, version,
                correlationId,
                safe(meta),
                payloadJson
        );
    }
    private static String safe(Object o) { return String.valueOf(o); }
}
