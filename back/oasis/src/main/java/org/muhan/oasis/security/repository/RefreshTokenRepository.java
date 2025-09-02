package org.muhan.oasis.security.repository;

import org.muhan.oasis.security.entity.RefreshTokenEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RefreshTokenRepository extends JpaRepository<RefreshTokenEntity, Long> {

    /**
     * 주어진 uuid 으로 저장된 RefreshToken 엔티티를 조회합니다.
     */
    Optional<RefreshTokenEntity> findByUuid(String uuid);

    /**
     * 주어진 uuid 으로 저장된 RefreshToken 레코드를 삭제합니다.
     */
    void deleteByUuid(String uuid);
}
