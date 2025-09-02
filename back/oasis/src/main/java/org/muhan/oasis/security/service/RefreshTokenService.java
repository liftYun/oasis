package org.muhan.oasis.security.service;

import org.muhan.oasis.security.entity.RefreshTokenEntity;
import org.muhan.oasis.security.jwt.JWTUtil;
import org.muhan.oasis.security.repository.RefreshTokenRepository;
import org.springframework.stereotype.Service;

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
        Optional<RefreshTokenEntity> tokenOpt = repository.findByUuid(uuid);
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

    /**
     * 로그인 시 새로 발급된 refresh token을 저장
     */
    public void saveToken(String uuid, String refreshToken) {
        // 이미 있으면 갱신, 없으면 신규 저장
        repository.findByUuid(uuid)
                .ifPresentOrElse(
                        t -> {
                            t.setToken(refreshToken);
                            repository.save(t);
                        },
                        () -> repository.save(new RefreshTokenEntity(uuid, refreshToken))
                );
    }

    /**
     * 로그아웃 등 필요 시 DB에서 refresh token 삭제
     */
    public void deleteToken(String uuid) {
        repository.deleteByUuid(uuid);
    }

    /**
     * 로그인 시, 혹은 refresh 토큰 재발급 시 호출
     * 이미 사용자(uuid)로 저장된 레코드가 있으면 토큰만 갱신하고,
     * 없으면 새로 생성
     */
    public void save(String uuid, String refreshToken) {
        repository.findByUuid(uuid)
                .ifPresentOrElse(
                        existing -> {
                            existing.setToken(refreshToken);
                            repository.save(existing);
                        },
                        () -> {
                            RefreshTokenEntity entity = new RefreshTokenEntity(uuid, refreshToken);
                            repository.save(entity);
                        }
                );
    }
}