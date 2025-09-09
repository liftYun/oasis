package org.muhan.oasis.stay.repository;

import org.muhan.oasis.stay.entity.StayEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StayRepository extends JpaRepository<StayEntity, Long> {
}
