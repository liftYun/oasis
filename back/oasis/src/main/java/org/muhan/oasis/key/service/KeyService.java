package org.muhan.oasis.key.service;

import org.muhan.oasis.key.dto.in.ShareKeyRequestDto;
import org.muhan.oasis.key.vo.in.ShareKeyRequestVo;
import org.springframework.stereotype.Service;

public interface KeyService {
    Long issueKeysForAllUsers(ShareKeyRequestDto shareKeyRequestDto);
}
