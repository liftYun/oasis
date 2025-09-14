package org.muhan.oasis.security.service;

import jakarta.transaction.Transactional;
import org.muhan.oasis.security.entity.RefreshTokenEntity;
import org.muhan.oasis.security.jwt.JWTUtil;
import org.muhan.oasis.security.repository.RefreshTokenRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.Optional;

@Service
public class RefreshTokenService {

    private final RefreshTokenRepository repository;
    private final JWTUtil jwtUtil;

    public RefreshTokenService(RefreshTokenRepository repository, JWTUtil jwtUtil) {
        this.repository = repository;
        this.jwtUtil = jwtUtil;
    }

    /**
     * DB에 저장된 refresh token과 전달받은 토큰을 비교하고,
     * JWTUtil.isExpired로 만료 여부까지 검사합니다.
     */
    public boolean isValid(String uuid, String refreshToken) {
        Optional<RefreshTokenEntity> tokenOpt = repository.findByUserUuid(uuid);
        if (tokenOpt.isEmpty()) {
            return false;
        }
        RefreshTokenEntity stored = tokenOpt.get();
        // 1) 문자열 일치 여부
        if (!stored.getToken().equals(refreshToken)) {
            return false;
        }
        // 2) 만료 여부 검사
        return !jwtUtil.isExpired(refreshToken);
    }

    @Transactional
    public void saveToken(String uuid, String refreshToken) {

        // 기존 토큰 삭제
        repository.deleteByUserUuid(uuid);
        repository.flush();

        RefreshTokenEntity n = new RefreshTokenEntity(uuid, refreshToken, new Date(System.currentTimeMillis() + jwtUtil.getRefreshExpiredMs()));

        repository.save(n);
    }

    /**
     * 로그아웃 등 필요 시 DB에서 refresh token 삭제
     */
    @Transactional
    public void deleteToken(String uuid) {
        repository.deleteByUserUuid(uuid);
    }
}