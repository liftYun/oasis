package org.muhan.oasis.security.jwt;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import jakarta.servlet.http.Cookie;
import lombok.Getter;
import org.muhan.oasis.valueobject.Language;
import org.muhan.oasis.valueobject.Role;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Component
public class JWTUtil {

    private SecretKey secretKey;
    /**
     * -- GETTER --
     * Access Token 만료시간(ms) 반환 (필요하면)
     */
    // access/refresh 용 만료시간 분리
    @Getter
    @Value("${jwt.access.expired-ms}") private long accessExpiredMs;
    /**
     * -- GETTER --
     * Refresh Token 만료시간(ms) 반환
     */
    @Getter
    @Value("${jwt.refresh.expired-ms}") private long refreshExpiredMs;

    public JWTUtil(@Value("${spring.jwt.secret}")String secret) {

        this.secretKey = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), Jwts.SIG.HS256.key().build().getAlgorithm());
    }

    public String getUserUuid(String token) {
        return Jwts.parser().verifyWith(secretKey).build().parseSignedClaims(token).getPayload().get("uuid", String.class);
    }

    public String getUserEmail(String token) {
        return Jwts.parser().verifyWith(secretKey).build().parseSignedClaims(token).getPayload().get("userEmail", String.class);
    }
    public String getProfileImg(String token) {
        return Jwts.parser().verifyWith(secretKey).build().parseSignedClaims(token).getPayload().get("profileImg", String.class);
    }

    public String getNickname(String token) {
        return Jwts.parser().verifyWith(secretKey).build().parseSignedClaims(token).getPayload().get("nickname", String.class);
    }

    public Role getRole(String token) {
        Claims claims = Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();

        String roleStr = claims.get("role", String.class); // String으로 꺼냄
        return Role.valueOf(roleStr); // Enum으로 변환
    }

    public String getLanguage(String token) {

        return Jwts.parser().verifyWith(secretKey).build().parseSignedClaims(token).getPayload().get("language", String.class);
    }

    public Boolean isExpired(String token) {
        try {
            return Jwts.parser().verifyWith(secretKey).build().parseSignedClaims(token).getPayload().getExpiration().before(new Date());
        } catch (ExpiredJwtException e) {
            e.printStackTrace();
            return true;
        }
    }

    public String createAccessToken(String uuid, String profileUrl, String nickname, Role role, Language language) {
        return Jwts.builder()
                .claim("uuid", uuid)
                .claim("profileUrl", profileUrl)
                .claim("nickname", nickname)
                .claim("role", role.name())
                .claim("language", language.name())
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + accessExpiredMs))
                .signWith(secretKey)
                .compact();
    }

    public String createRefreshToken(String uuid) {
        return Jwts.builder()
                .claim("uuid", uuid)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + refreshExpiredMs))
                .signWith(secretKey)
                .compact();
    }

    // 서명 검증까지 수행하고 토큰의 Claims를 반환
    public Claims parseClaims(String token) {
        return Jwts.parser()                     // JwtParserBuilder 생성
                .verifyWith(secretKey)        // 서명 검증용 SecretKey 지정
                .build()                      // JwtParser 완성
                .parseSignedClaims(token)     // parseSignedClaims → Jwt<Header,Claims>
                .getPayload();                // Payload인 Claims 반환
    }
}
