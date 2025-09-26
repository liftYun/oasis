package org.muhan.oasis.user.repository;

import org.muhan.oasis.user.entity.UserEntity;
import org.muhan.oasis.valueobject.Language;
import org.muhan.oasis.valueobject.Role;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<UserEntity, Long> {

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

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("""
           update UserEntity u
              set u.language = :language,
                  u.updatedAt = CURRENT_TIMESTAMP
            where u.userId = :userId
           """)
    int updateLanguageById(@Param("userId") Long userId, @Param("language") Language language);

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("""
        update UserEntity u
           set u.nickname = :nickname,
               u.language = :language,
               u.role     = :role,
               u.firstLogin = :firstLogin
         where u.userId = :userId
    """)
    void updateUserById(@Param("userId") Long userId,
                          @Param("nickname") String nickname,
                          @Param("language") Language language,
                          @Param("role") Role role,
                        @Param("firstLogin")  Boolean firstLogin);
}
