package org.muhan.oasis.user.repository;

import org.muhan.oasis.user.entity.UserEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<UserEntity, Integer> {

    Boolean existsByNickname(String username);

    Optional<UserEntity> findByUserId(Long userId);

    Optional<UserEntity> findByNickname(String username);

    Optional<UserEntity> findByUserUuid(String uuid);

    Optional<UserEntity> findByEmail(String email);

    List<UserEntity> findAllByNicknameIn(List<String> nicknames);

    // 오토컴플리트: 부분 일치 + 제외 목록
    @Query("""
        select u
        from UserEntity u
        where lower(u.nickname) like lower(concat('%', :keyword, '%'))
          and (:excludeIds is null or u.userId not in :excludeIds)
    """)
    Page<UserEntity> searchByNickname(
            @Param("keyword") String keyword,
            @Param("excludeIds") List<Long> excludeIds,
            Pageable pageable
    );
}
