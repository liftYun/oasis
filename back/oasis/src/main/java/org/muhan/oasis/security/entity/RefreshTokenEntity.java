package org.muhan.oasis.security.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.Date;

@Entity
@Table(
        name = "refresh_tokens",
        uniqueConstraints = @UniqueConstraint(name = "ux_refresh_token_user", columnNames = "user_uuid"),
        indexes = @Index(name = "idx_refresh_token_user_uuid", columnList = "user_uuid")
)
@Getter @Setter @NoArgsConstructor
public class RefreshTokenEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")                     // 서러게이트 PK
    private Long id;

    @Column(name = "user_uuid", nullable = false)
    private String userUuid;                   // 비즈니스 키(사용자 UUID)

    @Column(name = "token", nullable = false, length = 512)
    private String token;

    @Column(name = "expires_at", nullable = false)
    private Date expiresAt;


    public RefreshTokenEntity(String userUuid, String token, Date expiresAt) {
        this.userUuid = userUuid;
        this.token = token;
        this.expiresAt = expiresAt;
    }
}
