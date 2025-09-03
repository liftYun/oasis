package org.muhan.oasis.security.repository;

import org.muhan.oasis.security.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<UserEntity, Integer> {

    Boolean existsByNickname(String username);

    UserEntity findByNickname(String username);

    Optional<UserEntity> findByUuid(String uuid);

    Optional<UserEntity> findByEmail(String email);
}
