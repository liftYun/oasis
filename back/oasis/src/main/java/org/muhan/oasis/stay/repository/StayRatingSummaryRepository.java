package org.muhan.oasis.stay.repository;

import org.muhan.oasis.stay.entity.StayRatingSummaryEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StayRatingSummaryRepository extends JpaRepository<StayRatingSummaryEntity, Long> {
}
