package org.muhan.oasis.mqtt.handler;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;

import java.time.Duration;

@Component
@RequiredArgsConstructor
public class DeviceMqttListener {
    private final StringRedisTemplate redis;
    private static final String D_ONLINE = "device:online:";

    // heartbeat 수신
    public void onHeartbeat(Long deviceId) {
        redis.opsForValue().set(D_ONLINE + deviceId, "1", Duration.ofSeconds(90));
    }

    // LWT offline 수신
    public void onOffline(Long deviceId) {
        redis.delete(D_ONLINE + deviceId);
    }
}

