package org.muhan.oasis.booking.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data @AllArgsConstructor
public class LockResponse {
    private List<Step> steps;
    private String challengeId;
    @Data @AllArgsConstructor public static class Step { String label; String challengeId; }
    public static LockResponse single(String id){ return new LockResponse(null, id); }
    public static LockResponse multi(List<Step> s){ return new LockResponse(s, null); }
}