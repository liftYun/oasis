package org.muhan.oasis.key.repository;

import org.muhan.oasis.key.entity.KeyEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface KeyRepository extends JpaRepository<KeyEntity, Long> {
    void findByKeyId(Long keyId);
}
