package org.muhan.oasis.stay.repository;

import org.muhan.oasis.stay.entity.DeviceEntity;
import org.muhan.oasis.stay.entity.SubRegionEngEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DeviceRepository extends JpaRepository<DeviceEntity, Long> {
}
