package org.muhan.oasis.key.repository;

import org.muhan.oasis.key.entity.KeyEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface KeyRepository extends JpaRepository<KeyEntity, Long> {
    void findByKeyId(Long keyId);
    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("delete from KeyEntity k where k.device.id = :stayId")
    int deleteByStayId(@Param("stayId") Long stayId);

    @Query("select k.keyId from KeyEntity k where k.device.id = :stayId")
    List<Long> findIdsByStayId(Long stayId);
}
