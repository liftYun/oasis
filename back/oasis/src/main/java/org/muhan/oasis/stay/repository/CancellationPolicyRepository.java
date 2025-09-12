package org.muhan.oasis.stay.repository;

import io.lettuce.core.dynamic.annotation.Param;
import org.muhan.oasis.stay.entity.CancellationPolicyEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

public interface CancellationPolicyRepository extends JpaRepository<CancellationPolicyEntity, Long> {

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("""
       update CancellationPolicyEntity c
          set c.active   = :active
        where c.id = :oldPolicyId
       """)
    int updatePolicy(@Param("oldPolicyId") Long oldPolicyId, @Param("active") boolean active);
}
