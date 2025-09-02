package org.muhan.oasis.security.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

/**
 * 사용자별 Refresh Token 을 저장하는 JPA 엔티티
 */
@Entity
@Table(name = "refresh_tokens",
        indexes = @Index(columnList = "uuid", name = "refresh_token_uuid"))
@Getter
@Setter
@NoArgsConstructor
public class RefreshTokenEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    /** 로그인한 사용자의 고유 아이디 */
    @Column(nullable = false, unique = true, length = 100)
    private String uuid;

    /** JWT Refresh Token 자체 문자열 */
    @Column(nullable = false, length = 512)
    private String token;

    private Date expiresAt;

    public RefreshTokenEntity(String uuid, String token) {
        this.uuid = uuid;
        this.token = token;
    }
}
