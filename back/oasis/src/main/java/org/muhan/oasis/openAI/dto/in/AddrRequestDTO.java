package org.muhan.oasis.openAI.dto.in;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AddrRequestDTO {

    private String detailAddress;
    private static final ObjectMapper MAPPER = new ObjectMapper();

}