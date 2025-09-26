package org.muhan.oasis.key.repository;

import org.muhan.oasis.key.entity.KeyEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface KeyRepository extends JpaRepository<KeyEntity, Long> {
    void findByKeyId(Long keyId);

    @Query("select k.keyId from KeyEntity k where k.device.id = :stayId")
    List<Long> findKeyIdsByStayId(Long stayId);

    @Modifying
    @Query("delete from KeyEntity k where k.device.id = :stayId")
    int deleteByDevice_Id(Long stayId);
}
