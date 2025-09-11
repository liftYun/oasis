package org.muhan.oasis.openAI.dto.in;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.muhan.oasis.valueobject.Language;

@Getter
@AllArgsConstructor
public class ReviewRequestDto {
    Long reviewId;
    String content;
    Language language;
}
