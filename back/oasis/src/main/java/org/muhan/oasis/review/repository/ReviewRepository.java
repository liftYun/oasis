package org.muhan.oasis.review.repository;

import org.muhan.oasis.reservation.entity.ReservationEntity;
import org.muhan.oasis.review.entity.ReviewEntity;
import org.muhan.oasis.user.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReviewRepository extends JpaRepository<ReviewEntity, Long> {
    boolean existsByReservation_ReservationIdAndUser_UserId(String reservationId, Long userId);
    // 작성자 기준으로 최신순 조회
    List<ReviewEntity> findAllByUser_UserIdOrderByCreatedAtDesc(Long userId);
}
