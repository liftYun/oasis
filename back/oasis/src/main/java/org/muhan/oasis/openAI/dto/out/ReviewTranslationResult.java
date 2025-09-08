package org.muhan.oasis.openAI.dto.out;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.NoArgsConstructor;

@JsonIgnoreProperties(ignoreUnknown = true)
@Getter @NoArgsConstructor
public class ReviewTranslationResult {
    private String detectedLocale;
    private double confidence;
    private boolean wasTranslated;
    private String targetLocale; // ko | en | null

    @Getter @NoArgsConstructor
    public static class TextOne {
        private String content; // null 가능
    }

    private TextOne englishVersion; // {content} 또는 null
    private TextOne koreanVersion;  // {content} 또는 null
}
