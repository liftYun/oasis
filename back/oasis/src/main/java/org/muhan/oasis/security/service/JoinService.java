package org.muhan.oasis.security.service;

import org.muhan.oasis.security.dto.in.RegistRequestDto;
import org.muhan.oasis.security.entity.UserEntity;
import org.muhan.oasis.security.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class JoinService {

    private final UserRepository userRepository;

    public JoinService(UserRepository userRepository) {

        this.userRepository = userRepository;
    }

    public void joinProcess(RegistRequestDto registRequestDto) {

        String nickname = registRequestDto.getNickname();
        if (userRepository.existsByNickname(nickname)) {

            return;
        }

        UserEntity data = new UserEntity();

        data.setUuid(java.util.UUID.randomUUID().toString());
        data.setNickname(registRequestDto.getNickname());
        data.setUserEmail(registRequestDto.getUserEmail());
        data.setRole(registRequestDto.getRole());

        userRepository.save(data);
    }
}
