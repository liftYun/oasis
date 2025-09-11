package org.muhan.oasis.circle.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CircleSingleResponse<T> {
    private T data;
}
