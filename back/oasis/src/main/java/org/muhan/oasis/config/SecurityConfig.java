package org.muhan.oasis.config;

import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.log4j.Log4j2;
import org.apache.logging.log4j.ThreadContext;
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
            JWTUtil jwtUtil, CustomOAuth2UserService customOAuth2UserService, RefreshTokenService refreshTokenService,
            OAuth2SuccessHandler oAuth2SuccessHandler, OAuth2FailureHandler oAuth2FailureHandler, CustomOidcUserService customOidcUserService
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

        log.info("[SECURITY] CORS configured: allowCredentials={}, originPatterns={}, methods={}, headers={}, exposedHeaders={}, maxAgeSec={}",
                cfg.getAllowCredentials(), cfg.getAllowedOriginPatterns(), cfg.getAllowedMethods(),
                cfg.getAllowedHeaders(), cfg.getExposedHeaders(), cfg.getMaxAge());

        return source;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        AuthenticationManager am = configuration.getAuthenticationManager();
        log.info("[SECURITY] AuthenticationManager created");
        return am;
    }

    @Bean
    public BCryptPasswordEncoder bCryptPasswordEncoder() {
        log.info("[SECURITY] BCryptPasswordEncoder bean initialized");
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        log.info("[SECURITY] Building SecurityFilterChain...");

        // 1) CORS
        http.cors(Customizer.withDefaults());
        log.debug("[SECURITY] CORS enabled");

        // 2) CSRF, FormLogin, BasicAuth 비활성화
        http.csrf(csrf -> csrf.disable());
        http.formLogin(form -> form.disable());
        http.httpBasic(basic -> basic.disable());
        log.debug("[SECURITY] Disabled CSRF/FormLogin/HttpBasic");

        // 3) 경로별 인가
        http.authorizeHttpRequests(auth -> auth
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                .requestMatchers(HttpMethod.GET,
                        "/api/v1/dev/**",
                        "/oauth2/authorization/**",
                        "/login/oauth2/code/**",
                        "/api/google/redirect",
                        "/api/google/login",
                        "/api/v1/health/**").permitAll()
                .requestMatchers(HttpMethod.POST,
                        "/api/v1/auth/refresh",
                        "/api/v1/auth/issue",
                        "/api/v1/auth/logout").permitAll()
                .requestMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll()
                .requestMatchers("/api/v1/**").authenticated()
                .anyRequest().authenticated()
        );
        log.info("[SECURITY] Authorization rules set (permitAll/authenticated paths configured)");

        // 인증 실패 시 401
        http.exceptionHandling(ex -> ex.authenticationEntryPoint(new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED)));
        log.debug("[SECURITY] AuthenticationEntryPoint=401 configured");

        // 4) JWT 필터
        http.addFilterBefore(new JWTFilter(jwtUtil), UsernamePasswordAuthenticationFilter.class);
        log.info("[SECURITY] JWTFilter registered before UsernamePasswordAuthenticationFilter");

        // 5) OAuth2
        OAuth2AuthorizationRequestResolver resolver =
                new DefaultOAuth2AuthorizationRequestResolver(clientRegistrationRepository, "/oauth2/authorization");

        http.oauth2Login(oauth2 -> oauth2
                .authorizationEndpoint(authz -> authz
                        .authorizationRequestResolver(resolver)
                        .authorizationRequestRepository(new HttpCookieOAuth2AuthorizationRequestRepository())
                )
                .redirectionEndpoint(redir -> redir.baseUri("/login/oauth2/code/*"))
                .userInfoEndpoint(ui -> ui
                        .userService(customOAuth2UserService)
                        .oidcUserService(customOidcUserService))
                .successHandler(oAuth2SuccessHandler)
                .failureHandler(oAuth2FailureHandler)
        );
        log.info("[SECURITY] OAuth2 login configured (authorization, redirection, userInfo, handlers)");

        // 6) 세션 Stateless
        http.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));
        log.info("[SECURITY] SessionCreationPolicy=STATELESS");

        SecurityFilterChain chain = http.build();
        log.info("[SECURITY] SecurityFilterChain built successfully");
        return chain;
    }
}
