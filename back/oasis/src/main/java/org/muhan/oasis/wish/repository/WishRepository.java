package org.muhan.oasis.wish.repository;

import org.muhan.oasis.wish.entity.WishEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WishRepository extends JpaRepository<WishEntity, Long> {
    List<WishEntity> findByUser_UserUuid(String uuid);
}
