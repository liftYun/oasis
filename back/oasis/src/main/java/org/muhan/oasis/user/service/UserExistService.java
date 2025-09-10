package org.muhan.oasis.user.service;

import org.muhan.oasis.user.entity.UserEntity;
import org.muhan.oasis.user.repository.UserRepository;

/**
 * 유저 존재 확인 전용 서비스
 * UserExistService.userExist(userId or userUuid)
 * 한줄로 확인 및 UserEntity 반환
 */
public interface UserExistService {
    UserEntity userExist(Long userId);
    UserEntity userExist(String userUuid);
}
