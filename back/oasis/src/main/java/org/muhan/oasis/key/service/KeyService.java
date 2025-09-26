package org.muhan.oasis.key.service;

import org.muhan.oasis.key.dto.in.RegistKeyRequestDto;
import org.muhan.oasis.key.dto.in.ShareKeyRequestDto;
import org.muhan.oasis.key.dto.out.KeyResponseDto;
import org.muhan.oasis.key.vo.in.ShareKeyRequestVo;
import org.springframework.stereotype.Service;

import java.util.List;

public interface KeyService {
    Long registKey(RegistKeyRequestDto registKeyRequestDto);

    Long issueKeysForAllUsers(ShareKeyRequestDto shareKeyRequestDto);

    String verifyOpenPermission(Long userId, Long keyId);

    List<KeyResponseDto> listKeysForGuest(Long userId);
}
