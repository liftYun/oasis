/*
package org.muhan.oasis.config;

import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.dto.redis.connection.RedisConnectionFactory;
import org.springframework.dto.redis.connection.RedisStandaloneConfiguration;
import org.springframework.dto.redis.connection.lettuce.LettuceConnectionFactory;
import org.springframework.dto.redis.core.RedisTemplate;
import org.springframework.dto.redis.repository.configuration.EnableRedisRepositories;
import org.springframework.dto.redis.serializer.StringRedisSerializer;

@Configuration
@EnableRedisRepositories
@Log4j2
public class RedisConfig  {

    @Value("${spring.dto.redis.host}")
    private String host;

    @Value("${spring.dto.redis.port}")
    private int port;

    @Value("${spring.dto.redis.password}")
    private String password;

    @Bean
    public RedisConnectionFactory redisConnectionFactory() {
        RedisStandaloneConfiguration redisConfiguration = new RedisStandaloneConfiguration();
        redisConfiguration.setHostName(host);
        redisConfiguration.setPort(port);
        redisConfiguration.setPassword(password);

        log.info("RedisConnectionFactory 생성됨 → host: {}, port: {}", host, port);

        LettuceConnectionFactory factory = new LettuceConnectionFactory(redisConfiguration);
        factory.afterPropertiesSet(); // 연결 확인

        try {
            factory.getConnection().ping();  // 연결 테스트
            log.info("Redis 연결 성공");
        } catch (Exception e) {
            log.error("Redis 연결 실패: {}", e.getMessage());
        }

        return factory;
    }

    @Bean
    @Primary
    public RedisTemplate<String, String> redisTemplate() {
        RedisTemplate<String, String> redisTemplate = new RedisTemplate<>();
        redisTemplate.setKeySerializer(new StringRedisSerializer());
        redisTemplate.setValueSerializer(new StringRedisSerializer());
        redisTemplate.setConnectionFactory(redisConnectionFactory());
        return redisTemplate;
    }


}
*/
