package org.muhan.oasis.openAI.dto.in;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.muhan.oasis.valueobject.Language;

@Getter
@AllArgsConstructor
public class
StayRequestDto {
    String detailAddress;
    String title;
    String content;
    String address;
    Language language;
}
