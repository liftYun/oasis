package org.muhan.oasis.openAI.dto.in;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.muhan.oasis.openAI.domain.OpenAIMessageEntity;

import java.util.List;


@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class OpenAiRequest {

    private String model;
    private List<OpenAIMessageEntity> messages;

    public OpenAiRequest(String model, List<OpenAIMessageEntity> messages) {
        this.model = model;
        this.messages = messages;
    }
}
