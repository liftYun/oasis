package org.muhan.oasis.openAI.dto.in;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Getter
@AllArgsConstructor
public class ReviewListRequestDTO {
    List<ReviewRequestDTO> reviews = new ArrayList<>();

    private static final ObjectMapper MAPPER = new ObjectMapper();

    @Override
    public String toString() {
        try {
            java.util.Map<String, Object> root = new java.util.LinkedHashMap<>();
            java.util.List<java.util.Map<String, Object>> arr = new java.util.ArrayList<>();

            if (reviews != null) {
                for (ReviewRequestDTO r : reviews) {
                    java.util.Map<String, Object> item = new java.util.LinkedHashMap<>();
                    String c = (r != null && r.getContent() != null) ? r.getContent() : "";
                    item.put("content", c);
                    arr.add(item);
                }
            }
            root.put("reviews", arr);
            return MAPPER.writeValueAsString(root);
        } catch (Exception e) {

            StringBuilder sb = new StringBuilder(64);
            sb.append("{\"reviews\":[");
            if (reviews != null) {
                for (int i = 0; i < reviews.size(); i++) {
                    ReviewRequestDTO r = reviews.get(i);
                    String c = (r != null && r.getContent() != null) ? r.getContent() : "";
                    sb.append("{\"content\":\"").append(escape(c)).append("\"}");
                    if (i < reviews.size() - 1) sb.append(",");
                }
            }
            sb.append("]}");
            return sb.toString();
        }
    }

    private static String escape(String s) {
        if (s == null) return "";
        StringBuilder sb = new StringBuilder(s.length() + 16);
        for (int i = 0; i < s.length(); i++) {
            char ch = s.charAt(i);
            switch (ch) {
                case '\\': sb.append("\\\\"); break;
                case '"':  sb.append("\\\""); break;
                case '\b': sb.append("\\b");  break;
                case '\f': sb.append("\\f");  break;
                case '\n': sb.append("\\n");  break;
                case '\r': sb.append("\\r");  break;
                case '\t': sb.append("\\t");  break;
                default:
                    if (ch < 0x20) sb.append(String.format("\\u%04x", (int) ch));
                    else sb.append(ch);
            }
        }
        return sb.toString();
    }
}
