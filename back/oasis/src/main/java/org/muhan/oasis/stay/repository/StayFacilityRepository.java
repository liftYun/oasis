package org.muhan.oasis.stay.repository;

import org.muhan.oasis.stay.entity.StayFacilityEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;

@Repository
public interface StayFacilityRepository extends JpaRepository<StayFacilityEntity, Long> {
    @Query("""
        select sf from StayFacilityEntity sf
        join fetch sf.facility
        where sf.stay.id = :stayId
    """)
    List<StayFacilityEntity> findWithFacilityByStayId(@Param("stayId") Long stayId);

    @Modifying
    @Query("delete from StayFacilityEntity sf where sf.stay.id = :stayId and sf.facility.id in :facilityIds")
    void deleteByStayIdAndFacilityIds(@Param("stayId") Long stayId, @Param("facilityIds") Collection<Long> facilityIds);

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("delete from StayFacilityEntity sf where sf.stay.id = :stayId")
    int deleteByStayId(Long stayId);
}
