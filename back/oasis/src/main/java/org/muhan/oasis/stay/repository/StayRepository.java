package org.muhan.oasis.stay.repository;


import org.muhan.oasis.stay.dto.out.StayCardByWishView;
import org.muhan.oasis.stay.dto.out.StayCardDto;
import org.muhan.oasis.stay.dto.out.StayCardView;
import org.muhan.oasis.stay.dto.out.StayChatResponseDto;
import org.muhan.oasis.stay.entity.CancellationPolicyEntity;
import org.muhan.oasis.stay.entity.StayEntity;
import org.springframework.data.domain.Page;
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


        @Query(
                value = """
        select new org.muhan.oasis.stay.dto.out.StayCardDto(
            s.id,
            case when :lang = 'KOR' then s.title else s.titleEng end,
            s.thumbnail,
            rs.avgRating,
            s.price
        )
        from StayEntity s
        left join s.ratingSummary rs
        where (:lastId is null or s.id < :lastId)
          and (:subRegionId is null
               or s.subRegionEntity.id = :subRegionId
               or s.subRegionEngEntity.id = :subRegionId)
          and (
               :checkIn is null or :checkout is null
               or not exists (
                    select 1
                    from StayBlockEntity br
                    where br.stay = s
                      and br.startDate <= :checkout
                      and br.endDate   >= :checkIn
               )
          )
        order by s.id desc
        """,
                countQuery = """
        select count(s.id)
        from StayEntity s
        where (:lastId is null or s.id < :lastId)
          and (:subRegionId is null
               or s.subRegionEntity.id = :subRegionId
               or s.subRegionEngEntity.id = :subRegionId)
          and (
               :checkIn is null or :checkout is null
               or not exists (
                    select 1
                    from StayBlockEntity br
                    where br.stay = s
                      and br.startDate <= :checkout
                      and br.endDate   >= :checkIn
               )
          )
        """
        )
        Page<org.muhan.oasis.stay.dto.out.StayCardDto> fetchCardsBy(
                @Param("lastId") Long lastId,                 // 첫 요청 null
                @Param("subRegionId") Long subRegionId,       // 선택
                @Param("checkIn") java.time.LocalDate checkIn,
                @Param("checkout") java.time.LocalDate checkout,
                @Param("lang") String lang,                   // "KOR" / "ENG"
                org.springframework.data.domain.Pageable pageable // PageRequest.of(0, size)
        );

    @Query(value = """
    SELECT
      s.stay_id AS stayId,
      CASE WHEN :lang = 'KOR' THEN s.title ELSE s.title_eng END AS title,
      s.thumbnail AS thumbnail,
      COALESCE(rs.avg_rating, 0) AS rating,
      s.price AS price,
      COUNT(w.wish_id) AS wishCount
    FROM stays s
    LEFT JOIN stay_rating_summary rs ON rs.stay_id = s.stay_id
    LEFT JOIN wishes w ON w.stay_id = s.stay_id
    GROUP BY s.stay_id, s.title, s.title_eng, rs.avg_rating, s.thumbnail, s.price
    ORDER BY wishCount DESC, s.stay_id DESC
    LIMIT 12
    """, nativeQuery = true)
    List<StayCardByWishView> findTop12ByWish(@Param("lang") String lang);

    @Query(value = """
        SELECT
          s.stay_id AS stayId,
          CASE WHEN :lang = 'KOR' THEN s.title ELSE s.title_eng END AS title,
          s.thumbnail AS thumbnail,
          COALESCE(rs.avg_rating, 0) AS rating,   
          s.price AS price
        FROM stays s
        LEFT JOIN stay_rating_summary rs ON rs.stay_id = s.stay_id
        ORDER BY COALESCE(rs.avg_rating, 0) DESC, s.stay_id DESC
        LIMIT 12
        """, nativeQuery = true)
    List<StayCardView> findTop12ByRating(@Param("lang") String lang);


    @Query("SELECT s FROM StayEntity s " +
            "JOIN FETCH s.cancellationPolicyEntity " +
            "WHERE s.id = :stayId")
    StayEntity findStayWithPolicy(@Param("stayId") Long stayId);

    @Query("""
      select new org.muhan.oasis.stay.dto.out.StayChatResponseDto(
        s.id,
        case when :language = 'KOR'
             then s.addressLine else s.addressLineEng end,
        s.thumbnail,
        s.title
      )
      from StayEntity s
      where s.id in :ids
    """)
    List<StayChatResponseDto> findChatInfo(@Param("language") String language,
                                           @Param("ids") List<Long> ids);

    @Query("""
      select
        s.id                                           as stayId,
        case when :lang = 'KOR' then s.title else s.titleEng end as title,
        s.thumbnail                                    as thumbnail,
        coalesce(rs.avgRating, 0)                      as rating,
        s.price                                        as price
      from StayEntity s
      left join s.ratingSummary rs
      where s.user.userId = :userId
      order by s.id desc
    """)
    List<StayCardView> findCardsByUserId(@Param("userId") Long userId, @Param("lang") String lang);

    @Query(value = """
        select cancellation_policy_id
        from stays
        where stay_id = :stayId
        """, nativeQuery = true)
    Optional<Long> findCancellationPolicyIdByStayId(@Param("stayId") Long stayId);
}

