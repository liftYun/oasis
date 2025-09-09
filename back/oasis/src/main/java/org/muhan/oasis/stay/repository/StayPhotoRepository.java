package org.muhan.oasis.stay.repository;

import org.muhan.oasis.stay.entity.StayPhotoEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StayPhotoRepository extends JpaRepository<StayPhotoEntity, Long> {
}
