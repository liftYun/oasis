package org.muhan.oasis.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.eclipse.paho.client.mqttv3.*;
import org.muhan.oasis.mqtt.service.DeviceStatusService;
import org.muhan.oasis.mqtt.service.MqttLogService;
import org.springframework.context.annotation.Configuration;

import jakarta.annotation.PostConstruct;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * MQTT 구독자 설정
 * ESP32로부터 온라인/오프라인 상태 및 서보모터 상태 메시지를 구독합니다.
 */
@Slf4j
@Configuration
@RequiredArgsConstructor
public class MqttSubscriberConfig {

    private final DeviceStatusService deviceStatusService;
    private final MqttLogService mqttLogService;
    private final MqttAsyncClient client;
    private final MqttConnectOptions options;

    @PostConstruct
    public void setupSubscriber() {
        try {
            // MQTT 브로커 연결
            connectToBroker();

            // 메시지 콜백 설정
            setupMessageCallback();

            // 필요한 토픽들 구독
            subscribeToTopics();

            log.info("[MQTT] Subscriber setup completed successfully");

        } catch (Exception e) {
            log.error("[MQTT] Failed to setup subscriber: {}", e.getMessage(), e);
        }
    }

    private void connectToBroker() throws MqttException {
        if (!client.isConnected()) {
            IMqttToken connectToken = client.connect(options);
            connectToken.waitForCompletion(10000); // 10초 대기
            log.info("[MQTT] Subscriber connected to broker");
        }
    }

    private void setupMessageCallback() {
        client.setCallback(new MqttCallback() {
            @Override
            public void connectionLost(Throwable cause) {
                log.warn("[MQTT] Subscriber connection lost: {}", cause.getMessage());
                // 자동 재연결은 MqttConnectOptions의 automaticReconnect로 처리됨
            }

            @Override
            public void messageArrived(String topic, MqttMessage message) throws Exception {
                handleIncomingMessage(topic, new String(message.getPayload()));
            }

            @Override
            public void deliveryComplete(IMqttDeliveryToken token) {
                // 구독자에서는 사용하지 않음
            }
        });
    }

    private void subscribeToTopics() throws MqttException {
        // 1. ESP32 LWT (Last Will and Testament) 메시지 구독
        // 패턴: status/{deviceId}/lwt
        client.subscribe("status/+/lwt", 1);
        log.info("[MQTT] Subscribed to: status/+/lwt");

        // 2. ESP32 서보모터 상태 메시지 구독  
        // 패턴: status/{deviceId}
        client.subscribe("status/+", 1);
        log.info("[MQTT] Subscribed to: status/+");
    }

    /**
     * 수신된 MQTT 메시지를 처리합니다.
     * @param topic 토픽
     * @param payload 메시지 내용
     */
    private void handleIncomingMessage(String topic, String payload) {
        try {
            log.debug("[MQTT] Received message - Topic: {}, Payload: {}", topic, payload);

            // 1. LWT (Last Will and Testament) 메시지 처리
            if (topic.matches("status/.+/lwt")) {
                handleLwtMessage(topic, payload);
            }
            // 2. 서보모터 상태 메시지 처리  
            else if (topic.matches("status/.+") && !topic.endsWith("/lwt")) {
                handleServoStatusMessage(topic, payload);
            }
            // 3. 알 수 없는 토픽
            else {
                log.debug("[MQTT] Unknown topic pattern: {}", topic);
            }

        } catch (Exception e) {
            log.error("[MQTT] Error handling message from topic {}: {}", topic, e.getMessage(), e);
        }
    }

    /**
     * LWT (Last Will and Testament) 메시지 처리
     * 토픽 예시: status/20/lwt, status/esp32-001/lwt
     * 페이로드: "online" 또는 "offline"
     */
    private void handleLwtMessage(String topic, String payload) {
        // 토픽에서 디바이스 ID 추출: status/20/lwt -> 20
        Pattern pattern = Pattern.compile("status/(.+)/lwt");
        Matcher matcher = pattern.matcher(topic);

        if (matcher.find()) {
            String deviceId = matcher.group(1);

            // esp32-001 형태면 숫자 부분만 추출
            deviceId = extractNumericDeviceId(deviceId);

            if ("online".equals(payload)) {
                deviceStatusService.setDeviceOnline(deviceId);
                // mqttLogService.saveStatusLog(deviceId, "ONLINE");
                log.info("[MQTT] Device {} came ONLINE", deviceId);
            } else if ("offline".equals(payload)) {
                deviceStatusService.setDeviceOffline(deviceId);
                // mqttLogService.saveStatusLog(deviceId, "OFFLINE");
                log.info("[MQTT] Device {} went OFFLINE", deviceId);
            } else {
                log.warn("[MQTT] Unknown LWT payload: {} from {}", payload, topic);
            }
        } else {
            log.warn("[MQTT] Invalid LWT topic format: {}", topic);
        }
    }

    /**
     * 서보모터 상태 메시지 처리
     * 토픽 예시: status/20, status/esp32-001
     * 페이로드 예시: {"state":"MOVED","note":"ok","cmdId":"cmd-abc123"}
     */
    private void handleServoStatusMessage(String topic, String payload) {
        // 토픽에서 디바이스 ID 추출: status/20 -> 20
        Pattern pattern = Pattern.compile("status/(.+)");
        Matcher matcher = pattern.matcher(topic);

        if (matcher.find()) {
            String deviceId = matcher.group(1);

            // esp32-001 형태면 숫자 부분만 추출
            deviceId = extractNumericDeviceId(deviceId);

            log.info("[MQTT] Servo status from device {}: {}", deviceId, payload);

            // 나중에 로그 파일 저장 기능 추가
            // mqttLogService.saveServoLog(deviceId, payload);

        } else {
            log.warn("[MQTT] Invalid status topic format: {}", topic);
        }
    }

    /**
     * 디바이스 ID에서 숫자 부분만 추출
     * 예: "esp32-001" -> "001", "20" -> "20"
     */
    private String extractNumericDeviceId(String deviceId) {
        if (deviceId.startsWith("esp32-")) {
            return deviceId.substring(6); // "esp32-" 제거
        }
        return deviceId;
    }
}