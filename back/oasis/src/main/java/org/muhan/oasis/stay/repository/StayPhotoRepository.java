package org.muhan.oasis.stay.repository;

import org.muhan.oasis.stay.entity.StayEntity;
import org.muhan.oasis.stay.entity.StayPhotoEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StayPhotoRepository extends JpaRepository<StayPhotoEntity, Long> {
    List<StayPhotoEntity> findAllByStay(StayEntity stay);

    @Query("select sp.photoKey from StayPhotoEntity sp where sp.stay.id = :stayId")
    List<String> findPhotoKeysByStayId(Long stayId);

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("delete from StayPhotoEntity sp where sp.stay.id = :stayId")
    int deleteByStayId(Long stayId);
}
