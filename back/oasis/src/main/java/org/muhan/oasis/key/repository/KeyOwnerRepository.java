package org.muhan.oasis.key.repository;

import org.muhan.oasis.key.entity.KeyOwnerEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface KeyOwnerRepository extends JpaRepository<KeyOwnerEntity, Long> {
    Optional<KeyOwnerEntity> findByUser_UserIdAndKey_KeyId(Long userId, Long keyId);

    boolean existsByKey_KeyIdAndUser_UserId(Long keyId, Long userId);

    List<KeyOwnerEntity> findAllByReservation_ReservationId(String reservationId);

    @Query("""
    select ko from KeyOwnerEntity ko
    join fetch ko.key k
    join fetch k.device d
    join fetch d.stay s
    left join fetch ko.reservation r
    where ko.user.userId = :userId
      and (k.expirationTime is null or k.expirationTime > :now)
    order by coalesce(r.checkinDate, k.activationTime) desc
    """)
    java.util.List<KeyOwnerEntity> findActiveKeysForGuest(@Param("userId") Long userId,
                                                          @Param("now") java.time.LocalDateTime now);

    /** key_id IN (...) 로 일괄 삭제 */
    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("delete from KeyOwnerEntity ko where ko.key.keyId in :keyIds")
    int deleteByKeyIds(Collection<Long> keyIds);
}
