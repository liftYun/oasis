package org.muhan.oasis.openAI.dto.out;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class AddrTranslationResult {

    private String detectedLocale;   // "ko" | "en" | "unknown"
    private Double confidence;       // e.g., 0.92
    private Boolean wasTranslated;   // true/false
    private String targetLocale;     // "ko" | "en" | null

    private Version englishVersion;  // {"detailAddress": "..."} or null
    private Version koreanVersion;   // {"detailAddress": "..."} or null

    @Getter
    @Setter
    @NoArgsConstructor
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Version {
        private String detailAddress; // may be null
    }

    public String getKorDetailAddr() {
        return koreanVersion.getDetailAddress();
    }

    public String getEngDetailAddr() {
        return englishVersion.getDetailAddress();
    }
}