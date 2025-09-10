package org.muhan.oasis.openAI.dto.out;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class ChatCompletionResponseDto {
    private List<Choice> choices;

    @Getter @NoArgsConstructor
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Choice {
        private Message message;
    }

    @Getter @NoArgsConstructor
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Message {
        private String content;
    }

    public String firstContent() {
        return (choices != null && !choices.isEmpty()
                && choices.get(0).getMessage() != null)
                ? choices.get(0).getMessage().getContent()
                : null;
    }
}
