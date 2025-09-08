package org.muhan.oasis.key.repository;

import org.muhan.oasis.key.entity.KeyOwnerEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface KeyOwnerRepository extends JpaRepository<KeyOwnerEntity, Long> {
    Optional<KeyOwnerEntity> findByUser_UserIdAndKey_KeyId(Long userId, Long keyId);

    boolean existsByKey_KeyIdAndUser_UserId(Long keyId, Long userId);
}
