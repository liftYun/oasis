package org.muhan.oasis.key.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.muhan.oasis.key.dto.in.ShareKeyRequestDto;
import org.muhan.oasis.key.vo.in.ShareKeyRequestVo;
import org.springframework.stereotype.Service;

@Service
@Log4j2
@RequiredArgsConstructor
public class KeyServiceImpl implements KeyService {

    @Override
    public Long issueKeysForAllUsers(ShareKeyRequestDto shareKeyRequestDto) {
        return null;
    }
}
