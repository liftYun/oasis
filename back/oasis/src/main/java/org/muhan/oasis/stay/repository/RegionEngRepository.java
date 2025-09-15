package org.muhan.oasis.stay.repository;

import org.muhan.oasis.stay.entity.RegionEngEntity;
import org.muhan.oasis.stay.entity.RegionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RegionEngRepository extends JpaRepository<RegionEngEntity, Long> {
}
