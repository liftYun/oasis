package org.muhan.oasis.openAI.dto.in;

import lombok.AllArgsConstructor;
import lombok.Getter;
import java.util.ArrayList;
import java.util.List;


@Getter
@AllArgsConstructor
public class ReviewListRequestDTO {
    List<ReviewRequestDTO> reviews = new ArrayList<>();

}
