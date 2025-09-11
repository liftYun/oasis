package org.muhan.oasis.circle.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CircleBalance {
    private CircleToken token;
    private String amount; // "10.000000" 형식
    private String updateDate;


}