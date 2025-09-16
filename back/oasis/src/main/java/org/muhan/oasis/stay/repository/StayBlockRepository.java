package org.muhan.oasis.stay.repository;

import org.muhan.oasis.stay.entity.StayBlockEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface StayBlockRepository extends JpaRepository<StayBlockEntity, Long> {
    List<StayBlockEntity> findAllByStayIdAndEndDateAfterOrderByStartDateAsc(
            Long stay_id, LocalDate endDate);

    void deleteByStayId(Long stayIdzsz);
}
