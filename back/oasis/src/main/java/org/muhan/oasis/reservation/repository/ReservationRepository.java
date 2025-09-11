package org.muhan.oasis.reservation.repository;

import org.muhan.oasis.reservation.entity.ReservationEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReservationRepository extends JpaRepository<ReservationEntity, Long> {
    List<ReservationEntity> findAllByUser_UserIdOrderByReservationDateDesc(Long userId);

}
