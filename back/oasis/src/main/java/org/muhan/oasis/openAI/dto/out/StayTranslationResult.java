package org.muhan.oasis.openAI.dto.out;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.NoArgsConstructor;

@JsonIgnoreProperties(ignoreUnknown = true)
@Getter
@NoArgsConstructor
public class StayTranslationResult {
    private String detectedLocale;   // "ko" | "en" | "unknown"
    private double confidence;
    private boolean wasTranslated;
    private String targetLocale;     // "ko" | "en" | null

    @Getter @NoArgsConstructor
    public static class TextPair {
        private String title;   // null 가능
        private String content; // null 가능
    }

    private TextPair englishVersion; // {title, content} 또는 null
    private TextPair koreanVersion;  // {title, content} 또는 null

    public String getEngTitle(){
        return englishVersion.getTitle();
    }

    public String getKorTitle(){
        return koreanVersion.getTitle();
    }

    public String getEngContent(){
        return englishVersion.getContent();
    }

    public String getKorContent(){
        return koreanVersion.getContent();
    }
}
