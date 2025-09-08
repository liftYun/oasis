package org.muhan.oasis.review.repository;

import org.muhan.oasis.review.entity.ReviewEntity;
import org.muhan.oasis.user.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReviewRepository extends JpaRepository<ReviewEntity, Long> {
    boolean existsByReservation_IdAndUser_Id(Long reservationId, Long userId);
}
