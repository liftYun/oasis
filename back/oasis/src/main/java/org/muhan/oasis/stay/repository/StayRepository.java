package org.muhan.oasis.stay.repository;

import org.muhan.oasis.stay.dto.out.StayCardDto;
import org.muhan.oasis.stay.dto.out.StayResponseDto;
import org.muhan.oasis.stay.entity.CancellationPolicyEntity;
import org.muhan.oasis.stay.entity.StayEntity;
import org.muhan.oasis.stay.entity.StayFacilityEntity;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
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

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("""
       update StayEntity s
          set s.cancellationPolicyEntity = :newPolicy
        where s.cancellationPolicyEntity = :oldPolicy
       """)
    int rebindCancellationPolicy(@Param("oldPolicy") CancellationPolicyEntity oldPolicy,
                                 @Param("newPolicy") CancellationPolicyEntity newPolicy);

    @Query("""
      select new org.muhan.oasis.stay.dto.out.StayCardDto(
          s.id,
          case when :lang = 'KOR' then s.title else s.titleEng end,
          s.thumbnail,
          rs.avgRating,         
          s.price
      )
      from StayEntity s
      left join s.ratingSummary rs
      """)
    List<StayCardDto> findCards(@Param("lang") String lang);

}
