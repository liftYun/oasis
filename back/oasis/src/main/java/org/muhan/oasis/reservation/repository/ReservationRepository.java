package org.muhan.oasis.reservation.repository;

import org.muhan.oasis.reservation.entity.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, String> {
    Optional<Reservation> findByTxHash(String txHash);

    @Query("""
        select r from Reservation r
        where r.settlement = false
          and (r.canceled is null or r.canceled = false)
          and r.checkoutDate <= :cutoff
        """)
    List<Reservation> findDueForRelease(@Param("cutoff") LocalDateTime cutoff);

    @Modifying
    @Query("""
        update Reservation r
        set r.settlement = true
        where r.reservationId = :resId
        """)
    int markSettled(@Param("resId") String reservationId);


}
