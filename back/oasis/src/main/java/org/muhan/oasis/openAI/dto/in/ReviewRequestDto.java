package org.muhan.oasis.openAI.dto.in;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.muhan.oasis.valueobject.Language;

@Getter
@AllArgsConstructor
public class ReviewRequestDto {
    String content;
    Language language;
}
