package org.muhan.oasis.openAI.dto.in;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.muhan.oasis.review.entity.ReviewEntity;
import org.muhan.oasis.valueobject.Language;

@Getter
@AllArgsConstructor
public class ReviewRequestDto {
    String content;
    Language language;

    public static ReviewRequestDto from(ReviewEntity r, Language language){
        String content;
        if(language.equals(Language.KOR)){
            content = r.getContent();
        }
        else content = r.getContentEng();
        return new ReviewRequestDto(
                content,
                language
        );
    }
}
