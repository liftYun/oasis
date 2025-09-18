package org.muhan.oasis.mqtt.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.eclipse.paho.client.mqttv3.IMqttToken;
import org.eclipse.paho.client.mqttv3.MqttAsyncClient;
import org.eclipse.paho.client.mqttv3.MqttConnectOptions;
import org.eclipse.paho.client.mqttv3.MqttMessage;
import org.muhan.oasis.config.MqttConfig;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.util.concurrent.TimeUnit;

@Slf4j
@Service
@RequiredArgsConstructor
public class MqttPublisherService {

    private final MqttAsyncClient client;
    private final MqttConnectOptions options;
    private final MqttConfig props;

    private void connectIfNeeded() {
        try {
            if (client.isConnected()) return;
            IMqttToken token = client.connect(options);
            token.waitForCompletion(TimeUnit.SECONDS.toMillis(10));
            log.info("[MQTT] Connected to broker. clientId={}", client.getClientId());
        } catch (Exception e) {
            throw new RuntimeException("MQTT 연결 실패: " + e.getMessage(), e);
        }
    }

    public void publish(String topic, String payload, Integer qos, Boolean retain) {
        connectIfNeeded();
        int q = (qos != null) ? qos : props.getQosDefault();
        boolean r = (retain != null) && retain;

        try {
            MqttMessage msg = new MqttMessage(payload.getBytes(StandardCharsets.UTF_8));
            msg.setQos(q);
            msg.setRetained(r);
            client.publish(topic, msg);
            log.info("[MQTT] PUBLISHED topic={}, qos={}, retain={}, payload={}", topic, q, r, payload);
        } catch (Exception e) {
            throw new RuntimeException("MQTT 발행 실패(topic=" + topic + "): " + e.getMessage(), e);
        }
    }

    public String topicPrefix() {
        return props.getTopicPrefix();
    }
}
