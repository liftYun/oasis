package org.muhan.oasis.stay.repository;

import org.muhan.oasis.stay.entity.StayEntity;
import org.muhan.oasis.stay.entity.StayFacilityEntity;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StayRepository extends JpaRepository<StayEntity, Long> {
    @Query("""
      select distinct s
      from StayEntity s
        join fetch s.user
        left join fetch s.ratingSummary
        join fetch s.subRegionEntity sr
        join fetch sr.region r
        join fetch s.subRegionEngEntity sre
        join fetch sre.region re
        left join fetch s.stayPhotoEntities p
      where s.id = :id
    """)
    Optional<StayEntity> findDetailForRead(@Param("id") Long id);
}
