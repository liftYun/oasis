package org.muhan.oasis.wish.repository;

import org.muhan.oasis.wish.entity.WishEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WishRepository extends JpaRepository<WishEntity, Long> {
}
