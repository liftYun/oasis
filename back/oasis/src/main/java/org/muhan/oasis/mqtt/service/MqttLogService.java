package org.muhan.oasis.mqtt.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.FileWriter;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class MqttLogService {

    private final ObjectMapper objectMapper;

    @Value("${mqtt.log.directory:/logs/mqtt}")
    private String logDirectory;

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd");
    private static final DateTimeFormatter TIMESTAMP_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    /**
     * 서보모터 동작 로그를 파일에 저장
     * @param deviceId ESP32 디바이스 ID (예: "20", "esp32-001")
     * @param payload JSON 형태의 상태 메시지
     */
    public void saveServoLog(String deviceId, String payload) {
        try {
            createLogDirectoryIfNotExists();

            // 파일명: servo_log_20_2024-09-23.log
            String fileName = String.format("servo_log_%s_%s.log",
                    deviceId, LocalDateTime.now().format(DATE_FORMATTER));

            Path logFilePath = Paths.get(logDirectory, fileName);
            String logEntry = createLogEntry(deviceId, payload);

            try (FileWriter writer = new FileWriter(logFilePath.toFile(), true)) {
                writer.write(logEntry);
                writer.write(System.lineSeparator());
                writer.flush();
            }

            log.info("[LOG] Servo log saved: {} -> {}", deviceId, fileName);

        } catch (Exception e) {
            log.error("[LOG] Failed to save servo log for device {}: {}", deviceId, e.getMessage(), e);
        }
    }

    private void createLogDirectoryIfNotExists() throws IOException {
        Path dirPath = Paths.get(logDirectory);
        if (!Files.exists(dirPath)) {
            Files.createDirectories(dirPath);
            log.info("[LOG] Created log directory: {}", dirPath);
        }
    }

    /**
     * 로그 엔트리 생성
     * @param deviceId 디바이스 ID
     * @param payload JSON 메시지
     * @return 포맷된 로그 엔트리
     */
    private String createLogEntry(String deviceId, String payload) {
        try {
            Map<String, Object> jsonMap = objectMapper.readValue(payload, Map.class);

            String timestamp = LocalDateTime.now().format(TIMESTAMP_FORMATTER);
            String state = (String) jsonMap.getOrDefault("state", "UNKNOWN");
            String note = (String) jsonMap.getOrDefault("note", "");
            String cmdId = (String) jsonMap.getOrDefault("cmdId", "");

            // 로그 포맷: [타임스탬프] 디바이스ID | 상태 | 노트 | 명령ID | 원본JSON
            return String.format("[%s] %s | %s | %s | %s | %s",
                    timestamp, deviceId, state, note, cmdId, payload);

        } catch (Exception e) {
            String timestamp = LocalDateTime.now().format(TIMESTAMP_FORMATTER);
            return String.format("[%s] %s | RAW | %s", timestamp, deviceId, payload);
        }
    }
    /**
     * 디바이스 온라인/오프라인 상태 변경 로그를 파일에 저장
     * @param deviceId ESP32 디바이스 ID
     * @param status "ONLINE" 또는 "OFFLINE"
     */
    public void saveStatusLog(String deviceId, String status) {
        try {
            createLogDirectoryIfNotExists();

            // 파일명: servo_log_20_2024-09-23.log (서보 로그와 같은 파일)
            String fileName = String.format("servo_log_%s_%s.log",
                    deviceId, LocalDateTime.now().format(DATE_FORMATTER));

            Path logFilePath = Paths.get(logDirectory, fileName);
            String logEntry = createStatusLogEntry(deviceId, status);

            try (FileWriter writer = new FileWriter(logFilePath.toFile(), true)) {
                writer.write(logEntry);
                writer.write(System.lineSeparator());
                writer.flush();
            }

            log.info("[LOG] Status log saved: {} -> {} ({})", deviceId, status, fileName);

        } catch (Exception e) {
            log.error("[LOG] Failed to save status log for device {}: {}", deviceId, e.getMessage(), e);
        }
    }

    /**
     * 상태 변경 로그 엔트리 생성
     * @param deviceId 디바이스 ID
     * @param status "ONLINE" 또는 "OFFLINE"
     * @return 포맷된 로그 엔트리
     */
    private String createStatusLogEntry(String deviceId, String status) {
        String timestamp = LocalDateTime.now().format(TIMESTAMP_FORMATTER);
        // 로그 포맷: [타임스탬프] 디바이스ID | 상태 | - | - | STATUS_CHANGE
        return String.format("[%s] %s | %s | - | - | STATUS_CHANGE",
                timestamp, deviceId, status);
    }
}