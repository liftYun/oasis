//package org.muhan.oasis.security.jwt;
//
//import jakarta.servlet.FilterChain;
//import jakarta.servlet.http.Cookie;
//import jakarta.servlet.http.HttpServletRequest;
//import jakarta.servlet.http.HttpServletResponse;
//import org.muhan.oasis.security.dto.out.CustomUserDetails;
//import org.muhan.oasis.security.service.RefreshTokenService;
//import org.springframework.security.authentication.AuthenticationManager;
//import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
//import org.springframework.security.core.Authentication;
//import org.springframework.security.core.AuthenticationException;
//import org.springframework.security.core.GrantedAuthority;
//import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
//
//import java.io.IOException;
//import java.util.Collection;
//import java.util.Iterator;
//
//public class LoginFilter extends UsernamePasswordAuthenticationFilter {
//
//    private final AuthenticationManager authenticationManager;
//    private final JWTUtil jwtUtil;
//    private final RefreshTokenService refreshTokenService;
//
//    public LoginFilter(AuthenticationManager authenticationManager, JWTUtil jwtUtil, RefreshTokenService refreshTokenService) {
//        this.authenticationManager = authenticationManager;
//        this.jwtUtil = jwtUtil;
//        this.refreshTokenService = refreshTokenService;
//    }
//
//    @Override
//    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) throws AuthenticationException {
//
//        String username = obtainUsername(request);
//        String password = obtainPassword(request);
//
//        UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(username, password, null);
//
//        return authenticationManager.authenticate(authToken);
//    }
//    //로그인 성공시 실행하는 메소드 (여기서 JWT를 발급)
//    @Override
//    protected void successfulAuthentication(HttpServletRequest request,
//                                            HttpServletResponse response,
//                                            FilterChain chain,
//                                            Authentication authentication) throws IOException {
//
//        CustomUserDetails customUserDetails = (CustomUserDetails) authentication.getPrincipal();
//
////        String username =  customUserDetails.getUsername();
//        String userEmail = customUserDetails.getUserEmail();
//        String nickname = customUserDetails.getUserNickname();
////        int userId = customUserDetails.getUserId();
//        String uuid = customUserDetails.getUserUuid();
//
//        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
//        Iterator<? extends GrantedAuthority> iterator = authorities.iterator();
//        GrantedAuthority auth = iterator.next();
//
//        String role = auth.getAuthority();
//
//        String accessToken = jwtUtil.createAccessToken(uuid, userEmail, nickname, role);
//        String refreshToken = jwtUtil.createRefreshToken(uuid);
//
//        // Refresh Token 을 DB 혹은 Redis 등에 저장 (토큰 회수/무효화 위해)
//        refreshTokenService.saveToken(uuid, refreshToken);
//
//        response.addHeader("Authorization", "Bearer " + accessToken);
//        // 보안성을 위해 HttpOnly Cookie 로 발급하는 것을 권장
//        Cookie cookie = new Cookie("refreshToken", refreshToken);
//        cookie.setHttpOnly(true);
//        cookie.setPath("/");
//        cookie.setMaxAge((int)(jwtUtil.getRefreshExpiredMs() / 1000));
//        response.addCookie(cookie);
//    }
//
//    //로그인 실패시 실행하는 메소드
//    @Override
//    protected void unsuccessfulAuthentication(HttpServletRequest request, HttpServletResponse response, AuthenticationException failed) {
//
//        response.setStatus(401);
//    }
//}
// OAuth2.0이면 이거 필요없지만 예비로 일단 둠...
