package org.muhan.oasis.openAI.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@JsonIgnoreProperties(ignoreUnknown = true)
public class OpenAIMessageEntity {

    // 메세지 역할 (user, assistant, system)
    private String role;

    // 메세지 내용
    private String content;

    public OpenAIMessageEntity(String role, String content) {
        this.role = role;
        this.content = content;
    }
}
