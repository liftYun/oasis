package org.muhan.oasis.config;

import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.log4j.Log4j2;
import org.muhan.oasis.security.Handler.OAuth2FailureHandler;
import org.muhan.oasis.security.Handler.OAuth2SuccessHandler;
import org.muhan.oasis.security.jwt.JWTFilter;
import org.muhan.oasis.security.jwt.JWTUtil;
import org.muhan.oasis.security.repository.HttpCookieOAuth2AuthorizationRequestRepository;
import org.muhan.oasis.security.service.CustomOAuth2UserService;
import org.muhan.oasis.security.service.CustomOidcUserService;
import org.muhan.oasis.security.service.RefreshTokenService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.security.oauth2.client.web.DefaultOAuth2AuthorizationRequestResolver;
import org.springframework.security.oauth2.client.web.OAuth2AuthorizationRequestResolver;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Collections;
import java.util.List;

@Configuration
@EnableWebSecurity
@Log4j2
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

    private final ClientRegistrationRepository clientRegistrationRepository;
    private final AuthenticationConfiguration authenticationConfiguration;
    private final JWTUtil jwtUtil;
    private final CustomOAuth2UserService customOAuth2UserService;
    private final RefreshTokenService refreshTokenService;
    private final OAuth2SuccessHandler oAuth2SuccessHandler;
    private final OAuth2FailureHandler oAuth2FailureHandler;
    private final CustomOidcUserService customOidcUserService;

    public SecurityConfig(
            ClientRegistrationRepository clientRegistrationRepository, AuthenticationConfiguration authenticationConfiguration,
            JWTUtil jwtUtil, CustomOAuth2UserService customOAuth2UserService, RefreshTokenService refreshTokenService, OAuth2SuccessHandler oAuth2SuccessHandler, OAuth2FailureHandler oAuth2FailureHandler, CustomOidcUserService customOidcUserService
    ) {
        this.clientRegistrationRepository = clientRegistrationRepository;
        this.authenticationConfiguration = authenticationConfiguration;
        this.jwtUtil = jwtUtil;
        this.customOAuth2UserService = customOAuth2UserService;
        this.refreshTokenService = refreshTokenService;
        this.oAuth2SuccessHandler = oAuth2SuccessHandler;
        this.oAuth2FailureHandler = oAuth2FailureHandler;
        this.customOidcUserService = customOidcUserService;
    }

    // CORS 단일 설정 (Security가 사용)
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration cfg = new CorsConfiguration();
        cfg.setAllowCredentials(true);

        // ✨ 패턴 사용 (서브도메인/동적 Origin 대응)
        cfg.setAllowedOriginPatterns(List.of(
                "https://*.stay-oasis.kr",
                "http://localhost:3000",
                "http://localhost:*"
        ));

        cfg.setAllowedMethods(List.of("GET","POST","PUT","DELETE","PATCH","OPTIONS"));
        cfg.setAllowedHeaders(List.of("Authorization","Content-Type","Accept","Origin","X-Requested-With"));
        cfg.setExposedHeaders(List.of("Authorization", "Set-Cookie"));
        cfg.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", cfg);
        return source;
    }


    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }

    @Bean
    public BCryptPasswordEncoder bCryptPasswordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        // 1) CORS 설정
        http.cors(Customizer.withDefaults());


        // 2) CSRF, FormLogin, BasicAuth 비활성화
        http.csrf(csrf -> csrf.disable());
        http.formLogin(form -> form.disable());
        http.httpBasic(basic -> basic.disable());

        // 3) 경로별 인가 설정
        http.authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers(HttpMethod.GET,
                                // 테스트용 토큰 발행
                                // 배포시 삭제
                                "/api/v1/dev/**",
                                "/oauth2/authorization/**",
                                "/login/oauth2/code/**",
                                "/api/google/redirect",
                                "/api/google/login",
                                "/api/v1/auth/existByNickname/**",
                                "/api/v1/health/**").permitAll()
                        .requestMatchers(HttpMethod.POST,
                                "/api/v1/auth/refresh",
                                "/api/v1/auth/issue",
                                "/api/v1/auth/logout").permitAll()
                        // Swagger, 공용 API
                        .requestMatchers( "/swagger-ui/**", "/v3/api-docs/**").permitAll()
                        // 토큰 보유자
                        .requestMatchers("/api/v1/**").authenticated()
                        // 역할별 접근 제어
//                .requestMatchers("/admin/**").hasRole("ADMIN")
//                .requestMatchers("/user/**").hasRole("USER")
                        .anyRequest().authenticated()
        );
        // 인증 실패 시 리다이렉트 대신 401 응답만
        http.exceptionHandling(ex -> ex
                .authenticationEntryPoint(new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED))
        );

        // 4) JWT 필터 등록 (모든 요청 앞에서 검사)
        http.addFilterBefore(new JWTFilter(jwtUtil), UsernamePasswordAuthenticationFilter.class);

        OAuth2AuthorizationRequestResolver resolver =
                new DefaultOAuth2AuthorizationRequestResolver(
                        clientRegistrationRepository,
                        "/oauth2/authorization" // 로그인 시작 URL prefix (공용)
                );

//        http.sessionManagement(session ->
//                session.sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED)
//        );

        http.oauth2Login(oauth2 -> oauth2
                // 로그인 시작점: /oauth2/authorization/{registrationId}
                // 리다이렉트 수신: /login/oauth2/code/{registrationId}
                        .authorizationEndpoint(authz -> authz
                                .authorizationRequestResolver(resolver)
                                .authorizationRequestRepository(new HttpCookieOAuth2AuthorizationRequestRepository())
                        )
                .redirectionEndpoint(redir -> redir.baseUri("/login/oauth2/code/*"))

                // 소셜별 사용자 정보 처리: 커스텀 OAuth2UserService (구글/네이버/카카오 모두 처리)
                .userInfoEndpoint(ui -> ui
                        .userService(customOAuth2UserService)
                        .oidcUserService(customOidcUserService)) // OIDC (구글))
//                .authorizationEndpoint(authz -> authz
//                        .authorizationRequestRepository(
//                                new org.springframework.security.oauth2.client.web.HttpSessionOAuth2AuthorizationRequestRepository()
//                        )
//                )
                // 성공 시: JWT 발급 등
                .successHandler(oAuth2SuccessHandler)
                // 실패 시 처리
                .failureHandler(oAuth2FailureHandler)
        );

        // 6) 세션 상태를 Stateless 로 설정
        http.sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
        );

        return http.build();
    }
}
