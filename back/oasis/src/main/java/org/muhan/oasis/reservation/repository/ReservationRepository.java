package org.muhan.oasis.reservation.repository;

import org.muhan.oasis.reservation.entity.ReservationEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ReservationRepository extends JpaRepository<ReservationEntity, Long> {
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
}
