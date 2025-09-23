package org.muhan.oasis.config;

import jakarta.annotation.PreDestroy;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.DisposableBean;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.http.HttpService;
import org.web3j.protocol.websocket.WebSocketService;

import java.net.ConnectException;

@Configuration
@Slf4j
public class Web3jConfig {

    @Value("${infura.url}")
    private String infuraWssUrl;

    private WebSocketService webSocketService;

    @Getter
    private Web3j web3j;

    @Bean
    public Web3j web3j() throws ConnectException {
        this.webSocketService = createAndConnect();
        this.web3j = Web3j.build(webSocketService);
        return this.web3j;
    }


    private WebSocketService createAndConnect() throws ConnectException {
        WebSocketService ws = new WebSocketService(infuraWssUrl, true);
        ws.connect();
        log.info("✅ Connected to Infura via WebSocket: {}", infuraWssUrl);
        return ws;
    }

    public synchronized void reconnect() {
        try {
            if (this.webSocketService != null) {
                this.webSocketService.close();
            }
            this.webSocketService = createAndConnect();
            this.web3j = Web3j.build(this.webSocketService);
            log.info("🔄 Web3j WebSocket reconnected");
        } catch (Exception e) {
            log.error("🚨 Failed to reconnect WebSocketService: {}", e.getMessage(), e);
        }
    }

    @PreDestroy
    public void shutdown() {
        if (this.webSocketService != null) {
            try {
                this.webSocketService.close();
                log.info("🛑 WebSocketService closed");
            } catch (Exception e) {
                log.warn("⚠️ Failed to close WebSocketService cleanly: {}", e.getMessage());
            }
        }
    }
}