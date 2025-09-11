package org.muhan.oasis.circle.dto;

import lombok.*;

import java.util.List;
import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CirclePagedResponse<T> {
    private List<T> tokenBalances;
    private Map<String, Object> pagination;
}
