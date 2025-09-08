package org.muhan.oasis.openAI.dto.in;


import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.*;

import java.util.LinkedHashMap;
import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AddrRequestDTO {

    private String detailAddress;

    private static final ObjectMapper MAPPER = new ObjectMapper();

    @Override
    public String toString() {
        try {
            Map<String, Object> root = new LinkedHashMap<>();
            root.put("detailAddress", detailAddress == null ? "" : detailAddress);
            return MAPPER.writeValueAsString(root);
        } catch (Exception e) {
            return "{\"detailAddress\":\"" + escape(detailAddress) + "\"}";
        }
    }

    private static String escape(String s) {
        if (s == null) return "";
        StringBuilder sb = new StringBuilder(s.length() + 16);
        for (int i = 0; i < s.length(); i++) {
            char c = s.charAt(i);
            switch (c) {
                case '\\': sb.append("\\\\"); break;
                case '"' : sb.append("\\\""); break;
                case '\b': sb.append("\\b");  break;
                case '\f': sb.append("\\f");  break;
                case '\n': sb.append("\\n");  break;
                case '\r': sb.append("\\r");  break;
                case '\t': sb.append("\\t");  break;
                default:
                    if (c < 0x20) sb.append(String.format("\\u%04x", (int) c));
                    else sb.append(c);
            }
        }
        return sb.toString();
    }
}