package org.muhan.oasis.user.service;

import org.muhan.oasis.common.base.BaseResponseStatus;
import org.muhan.oasis.common.exception.BaseException;
import org.muhan.oasis.user.repository.UserRepository;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.muhan.oasis.user.entity.UserEntity;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserExistServiceImpl implements UserExistService{
    private final UserRepository userRepository;
    @Override
    public UserEntity userExist(Long userId) {
        if (userId == null || userId <= 0) {
            throw new BaseException(BaseResponseStatus.INVALID_PARAMETER);
        }
        return userRepository.findById(userId) // PK면 findById 사용 권장
                .orElseThrow(() -> new BaseException(BaseResponseStatus.NO_EXIST_USER));
    }

    @Override
    public UserEntity userExist(String userUuid) {
        if (userUuid == null) {
            throw new BaseException(BaseResponseStatus.INVALID_PARAMETER);
        }
        return userRepository.findByUserUuid(userUuid)
                .orElseThrow(() -> new BaseException(BaseResponseStatus.NO_EXIST_USER));
    }
}
