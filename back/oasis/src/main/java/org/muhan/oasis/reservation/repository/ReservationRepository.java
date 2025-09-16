package org.muhan.oasis.reservation.repository;

import org.muhan.oasis.reservation.entity.ReservationEntity;
import org.muhan.oasis.stay.dto.out.ReservedResponseDto;
import org.muhan.oasis.stay.entity.StayEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ReservationRepository extends JpaRepository<ReservationEntity, String> {
    List<ReservationEntity> findAllByUser_UserIdOrderByReservationDateDesc(Long userId);

    @Query("""
        select new org.muhan.oasis.reservation.repository.ReservationPeriodRow(
            r.checkinDate, r.checkoutDate
        )
        from ReservationEntity r
        where r.stay.id = :stayId
          and r.isCancled = false
          and r.checkoutDate >= :todayStart
        order by r.checkinDate asc
    """)
    List<ReservationPeriodRow> findFuturePeriodsByStayId(
            @Param("stayId") Long stayId,
            @Param("todayStart") LocalDateTime todayStart
    );

    @Query("""
      select new org.muhan.oasis.stay.dto.out.ReservedResponseDto(
        function('date', r.checkinDate),
        function('date', r.checkoutDate)
      )
      from ReservationEntity r
      where r.stay.id = :stayId
      order by r.checkinDate
    """)
    List<ReservedResponseDto> findAllReservedByStayId(@Param("stayId") Long stayId);

    @Query("""
      select count(r) > 0 from ReservationEntity r
      where r.stay.id = :stayId
        and r.checkinDate < :end
        and r.checkoutDate   > :start
    """)
    boolean existsConfirmedOverlap(@Param("stayId") Long stayId,
                                   @Param("start") LocalDateTime start,
                                   @Param("end") LocalDateTime end);
}
