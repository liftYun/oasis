package org.muhan.oasis.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.http.HttpService;
import org.web3j.protocol.websocket.WebSocketService;

import java.net.ConnectException;

@Configuration
public class Web3jConfig {

    @Value("${infura.url}")
    private String infuraUrl;

    @Bean
    public Web3j web3j() throws ConnectException {
        WebSocketService webSocketService = new WebSocketService(infuraUrl, true);
        webSocketService.connect();
        return Web3j.build(webSocketService);
    }
}