package org.muhan.oasis.stay.repository;

import org.muhan.oasis.stay.entity.StayFacilityEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StayFacilityRepository extends JpaRepository<StayFacilityEntity, Long> {
    @Query("""
        select sf from StayFacilityEntity sf
        join fetch sf.facility
        where sf.stay.id = :stayId
    """)
    List<StayFacilityEntity> findWithFacilityByStayId(@Param("stayId") Long stayId);


}
