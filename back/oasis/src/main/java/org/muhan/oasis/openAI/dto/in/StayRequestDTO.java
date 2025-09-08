package org.muhan.oasis.openAI.dto.in;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.LinkedHashMap;
import java.util.Map;

@Getter
@AllArgsConstructor
public class StayRequestDTO {
    String title;
    String content;

    private static final ObjectMapper MAPPER = new ObjectMapper();

    @Override
    public String toString() {
        try {
            // 키 순서 보장 위해 LinkedHashMap 사용 (title -> content)
            Map<String, Object> root = new LinkedHashMap<>();
            root.put("title",  title  == null ? "" : title);
            root.put("content", content == null ? "" : content);
            return MAPPER.writeValueAsString(root);
        } catch (Exception e) {
            // 혹시 모를 실패 대비한 최소한의 폴백
            return "{\"title\":\"" + escape(title) + "\",\"content\":\"" + escape(content) + "\"}";
        }
    }

    private static String escape(String s) {
        if (s == null) return "";
        StringBuilder sb = new StringBuilder(s.length() + 16);
        for (int i = 0; i < s.length(); i++) {
            char c = s.charAt(i);
            switch (c) {
                case '\\': sb.append("\\\\"); break;
                case '"':  sb.append("\\\""); break;
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
