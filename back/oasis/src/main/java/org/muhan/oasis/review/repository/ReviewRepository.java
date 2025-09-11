package org.muhan.oasis.review.repository;

import org.muhan.oasis.reservation.entity.ReservationEntity;
import org.muhan.oasis.review.entity.ReviewEntity;
import org.muhan.oasis.user.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ReviewRepository extends JpaRepository<ReviewEntity, Long> {
    boolean existsByReservation_ReservationIdAndUser_UserId(String reservationId, Long userId);
    // 작성자 기준으로 최신순 조회
    List<ReviewEntity> findAllByUser_UserIdOrderByCreatedAtDesc(Long userId);

//    List<ReviewEntity> findAllByStayIdOrderByCreatedAtDesc(Long stayId);
    @Query("""
      select r
        from ReviewEntity r
        join fetch r.reservation res
        join fetch res.stay s
        join fetch r.user u
       where s.id = :stayId
    order by r.createdAt desc
    """)
    List<ReviewEntity> findAllByStayIdOrderByCreatedAtDescWithJoins(@Param("stayId") Long stayId);
}
