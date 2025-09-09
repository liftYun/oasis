package org.muhan.oasis.stay.repository;

import org.muhan.oasis.stay.entity.SubRegionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SubRegionRepository extends JpaRepository<SubRegionEntity, Long> {
}
