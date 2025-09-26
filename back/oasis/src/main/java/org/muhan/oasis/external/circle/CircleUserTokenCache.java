package org.muhan.oasis.external.circle;

import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class CircleUserTokenCache {
    private final Map<String, Entry> map = new ConcurrentHashMap<>();
    private static final Duration TTL = Duration.ofMinutes(60); // 60분 만료

    public Entry get(String userId) {
        Entry e = map.get(userId);
        if (e == null) {
            return null;
        }
        if (Instant.now().isAfter(e.getExpiresAt())) {
            map.remove(userId);
            return null;
        }
        return e;
    }

    public void put(String userId, String userToken, String encryptionKey) {
        map.put(userId, new Entry(userToken, encryptionKey, Instant.now().plus(TTL)));
    }

    @Data
    @AllArgsConstructor
    public static class Entry {
        private String userToken;
        private String encryptionKey;
        private Instant expiresAt;
    }
}