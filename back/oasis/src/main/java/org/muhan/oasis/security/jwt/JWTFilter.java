package org.muhan.oasis.security.jwt;

import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.muhan.oasis.security.dto.in.UserDetailRequestDto;
import org.muhan.oasis.security.dto.out.CustomUserDetails;
import org.muhan.oasis.valueobject.Language;
import org.muhan.oasis.valueobject.Role;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

public class JWTFilter extends OncePerRequestFilter {

    private final JWTUtil jwtUtil;

    public JWTFilter(JWTUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        //request에서 Authorization 헤더를 찾음
        String authorization = request.getHeader("Authorization");

        // Authorization 헤더 검증
        if(authorization == null || !authorization.startsWith("Bearer ")) {
//            System.out.println("token null");
            filterChain.doFilter(request, response);

            // 조건 해당 시 메소드 종료
            return;
        }

        String token = authorization.split(" ")[1];

        // 토큰 소멸 시간 검증
        if(jwtUtil.isExpired(token)) {
            throw new JwtException("Access token expired");
        }

        //토큰에서 id, email, nickname과 role 획득
        String uuid = jwtUtil.getUserUuid(token);
        String userEmail = jwtUtil.getUserEmail(token);
        String nickname = jwtUtil.getNickname(token);
        Role role = jwtUtil.getRole(token);
        Language lang = Language.valueOf(jwtUtil.getLang(token));

        //user를 생성하여 값 set
        UserDetailRequestDto userDetailRequestDto = new UserDetailRequestDto();
        userDetailRequestDto.setUuid(uuid);
        userDetailRequestDto.setUserEmail(userEmail);
        userDetailRequestDto.setNickname(nickname);
        userDetailRequestDto.setRole(role);
        userDetailRequestDto.setLanguage(lang);

        //UserDetails에 회원 정보 객체 담기
        CustomUserDetails customUserDetails = new CustomUserDetails(UserDetailRequestDto.from(userDetailRequestDto));

        //스프링 시큐리티 인증 토큰 생성
        Authentication authToken = new UsernamePasswordAuthenticationToken(customUserDetails, null, customUserDetails.getAuthorities());
        //세션에 사용자 등록
        SecurityContextHolder.getContext().setAuthentication(authToken);

        filterChain.doFilter(request, response);
    }
}
