package org.muhan.oasis.openAI.dto.in;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class ReviewListRequestDto {
    List<ReviewRequestDto> reviews = new ArrayList<>();
}
