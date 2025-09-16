package org.muhan.oasis.stay.repository;

import org.muhan.oasis.stay.entity.StayEntity;
import org.muhan.oasis.stay.entity.StayPhotoEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StayPhotoRepository extends JpaRepository<StayPhotoEntity, Long> {
    List<StayPhotoEntity> findAllByStay(StayEntity stay);

    void deleteByPhotoKeys(List<String> keysToDelete);
}
