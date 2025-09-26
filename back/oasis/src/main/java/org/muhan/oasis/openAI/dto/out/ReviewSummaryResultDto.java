package org.muhan.oasis.openAI.dto.out;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
@Getter @NoArgsConstructor
public class ReviewSummaryResultDto {

    @Getter @NoArgsConstructor
    public static class InputCounts {
        private int total;
        private int unique;
        private int ko;
        private int en;
    }

    @Getter @NoArgsConstructor
    public static class Version {
        private String summary;     // 빈 문자열 가능
        private List<String> bullets; // []
    }

    private InputCounts inputCounts;
    private boolean wasDeduplicated;
    private Version englishVersion;
    private Version koreanVersion;
}
