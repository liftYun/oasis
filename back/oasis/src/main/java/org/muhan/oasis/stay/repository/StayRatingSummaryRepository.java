package org.muhan.oasis.stay.repository;

import org.muhan.oasis.stay.entity.StayRatingSummaryEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StayRatingSummaryRepository extends JpaRepository<StayRatingSummaryEntity, Long> {
    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("delete from StayRatingSummaryEntity rs where rs.stay.id = :stayId")
    int deleteByStayId(Long stayId);
}
