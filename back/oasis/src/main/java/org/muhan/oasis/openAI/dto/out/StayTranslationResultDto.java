package org.muhan.oasis.openAI.dto.out;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.NoArgsConstructor;

@JsonIgnoreProperties(ignoreUnknown = true)
@Getter
@NoArgsConstructor
public class StayTranslationResultDto {
    private String detailAddress;
    private String title;
    private String content;
}
