package org.muhan.oasis.security.vo.out;

import org.springframework.http.ResponseCookie;

public record TokenPair(
        String accessToken,
        ResponseCookie refreshCookie
) {
}
