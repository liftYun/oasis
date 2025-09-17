package org.muhan.oasis.security.repository;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;

import java.util.Arrays;
import java.util.Optional;

public class CookieUtils {

    public static Optional<Cookie> getCookie(HttpServletRequest request, String name) {
        if (request.getCookies() == null) return Optional.empty();
        return Arrays.stream(request.getCookies())
                .filter(cookie -> cookie.getName().equals(name))
                .findFirst();
    }

    public static void addCookie(HttpServletResponse response, String name, String value, int maxAge) {
        ResponseCookie cookie = ResponseCookie.from(name, value)
                .httpOnly(true)
                .secure(true) // 로컬 테스트는 false, 배포는 true
                .sameSite("None") // 크로스 도메인에서도 전달되도록
                .path("/")
//                .domain("localhost")
                .domain(".stay-oasis.kr")
                .maxAge(maxAge)
                .build();
        response.setHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    }


    public static void deleteCookie(HttpServletRequest request,
                                    HttpServletResponse response,
                                    String name) {
        if (request.getCookies() == null) return;
        Arrays.stream(request.getCookies())
                .filter(c -> c.getName().equals(name))
                .forEach(c -> {
                    c.setValue("");
                    c.setPath("/");
                    c.setMaxAge(0);
                    response.addCookie(c);
                });
    }
}
