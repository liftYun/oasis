package org.muhan.oasis.stay.repository;

import org.muhan.oasis.stay.entity.StayFacilityEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StayFacilityRepository extends JpaRepository<StayFacilityEntity, Long> {
}
