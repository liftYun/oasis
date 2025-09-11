package org.muhan.oasis.booking;


import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class UserSessionStore {
    @Data @AllArgsConstructor
    public static class Session {
        private String userToken;
        private String walletId;
    }
    private final Map<String, Session> map = new ConcurrentHashMap<>();
    public Session get(String userId) { return map.get(userId); }
    public void put(String userId, Session s) { map.put(userId, s); }
}