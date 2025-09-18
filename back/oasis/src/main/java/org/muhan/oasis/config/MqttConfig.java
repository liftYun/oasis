package org.muhan.oasis.config;

import lombok.Getter;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import org.eclipse.paho.client.mqttv3.MqttAsyncClient;
import org.eclipse.paho.client.mqttv3.MqttClientPersistence;
import org.eclipse.paho.client.mqttv3.MqttConnectOptions;
import org.eclipse.paho.client.mqttv3.persist.MemoryPersistence;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Slf4j
@Getter
@Setter
@Configuration
@ConfigurationProperties(prefix = "mqtt")
public class MqttConfig {

    private String host;
    private int port;
    private String username;
    private String password;
    private String clientId;
    private boolean ssl;
    private int keepAliveSeconds = 30;
    private int qosDefault = 1;
    private String topicPrefix = "cmd";

    @Bean
    public MqttClientPersistence mqttPersistence() {
        // 디스크 대신 메모리 사용 → 배포 환경 파일권한/경로 이슈 제거
        return new MemoryPersistence();
    }

    @Bean
    public MqttConnectOptions mqttConnectOptions() {
        MqttConnectOptions opts = new MqttConnectOptions();
        String uri = (ssl ? "ssl" : "tcp") + "://" + host + ":" + port;
        opts.setServerURIs(new String[]{uri});
        opts.setCleanSession(true);
        opts.setAutomaticReconnect(true);
        opts.setKeepAliveInterval(keepAliveSeconds);
        if (username != null) opts.setUserName(username);
        if (password != null) opts.setPassword(password.toCharArray());
        // TLS(ssl=true)일 때는 기본 JRE TrustStore 사용 (공인 인증서 가정)
        log.info("[MQTT] uri={}, clientId={}, ssl={}, keepAliveSec={}", uri, clientId, ssl, keepAliveSeconds);
        return opts;
    }

    @Bean
    public MqttAsyncClient mqttAsyncClient() throws Exception {
        return new MqttAsyncClient((ssl ? "ssl" : "tcp") + "://" + host + ":" + port, clientId);
    }
}
