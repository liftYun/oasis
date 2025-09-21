package org.muhan.oasis.reservation.repository;

import org.muhan.oasis.reservation.entity.ReservationEntity;
import org.muhan.oasis.stay.dto.out.ReservedResponseDto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

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
          and r.isCanceled = false
          and r.checkoutDate >= :todayStart
        order by r.checkinDate asc
    """)
    List<ReservationPeriodRow> findFuturePeriodsByStayId(
            @Param("stayId") Long stayId,
            @Param("todayStart") LocalDateTime todayStart
    );

    @Modifying
    @Transactional
    @Query("UPDATE ReservationEntity r SET r.isCanceled = true WHERE r.reservationId = :reservationId")
    void markCanceled(@Param("reservationId") String reservationId);
    // ✅ 정산 안 된 예약 전체 조회
    List<ReservationEntity> findByIsSettlementedFalseAndCheckoutDateBefore(LocalDateTime now);


    // ✅ 특정 예약 정산 처리 (settlement = true 업데이트)
    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Transactional
    @Query("update ReservationEntity r set r.isSettlemented = true where r.reservationId = :resId")
    int markSettled(String resId);

    @Query("""
      select new org.muhan.oasis.stay.dto.out.ReservedResponseDto(
        r.checkinDate,
        r.checkoutDate
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
