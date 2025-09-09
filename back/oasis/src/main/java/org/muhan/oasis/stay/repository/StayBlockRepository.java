package org.muhan.oasis.stay.repository;

import org.muhan.oasis.stay.entity.StayBlockEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StayBlockRepository extends JpaRepository<StayBlockEntity, Long> {
}
