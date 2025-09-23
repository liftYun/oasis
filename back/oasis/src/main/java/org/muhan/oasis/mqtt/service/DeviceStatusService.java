package org.muhan.oasis.mqtt.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;

@Slf4j
@Service
@RequiredArgsConstructor
public class DeviceStatusService {

    private final StringRedisTemplate redis;

    private static final String DEVICE_ONLINE_PREFIX = "device:online:";
    private static final Duration ONLINE_TTL = Duration.ofSeconds(90);

    public void setDeviceOnline(String deviceId) {
        String key = DEVICE_ONLINE_PREFIX + deviceId;
        // redis.opsForValue().set(key, "true", ONLINE_TTL); // 90초 제한
        redis.opsForValue().set(key, "true");
        log.info("[DEVICE] {} is now ONLINE", deviceId);
    }

    public void setDeviceOffline(String deviceId) {
        String key = DEVICE_ONLINE_PREFIX + deviceId;
        redis.opsForValue().set(key, "false");
        log.info("[DEVICE] {} is now OFFLINE", deviceId);
    }

    public boolean isDeviceOnline(String deviceId) {
        String key = DEVICE_ONLINE_PREFIX + deviceId;
        String status = redis.opsForValue().get(key);
        return "true".equals(status);
    }
}