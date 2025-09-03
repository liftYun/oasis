package org.muhan.oasis.security.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import org.muhan.oasis.valueobject.Language;
import org.muhan.oasis.valueobject.Role;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

//@Entity
//@Getter
//@Setter
//@AllArgsConstructor
//@Builder
//public class UserEntity {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private long id;
//
//    @Column(nullable = false, unique = true, length = 100)
//    private String uuid;
//    private String nickname;
//    private String userEmail;
//    private Language language;
//    private String profileUrl;
//    private String certificateUrl;
//    private String role;
//
//    public UserEntity() {
//
//    }
//}
@Entity
@Getter
@Setter
@Builder
@Table(name = "users",
        uniqueConstraints = {
                @UniqueConstraint(name = "uk_users_email", columnNames = "email"),
                @UniqueConstraint(name = "uk_users_nickname", columnNames = "nickname")
        })
@EntityListeners(AuditingEntityListener.class)
@AllArgsConstructor
public class UserEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_uuid")      // BIGINT PK
    private Long uuid;

    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false, length = 20)
    private Role role;

    @Column(name = "nickname", length = 100, unique = true)
    private String nickname;

    @Column(name = "email", nullable = false, length = 255, unique = true)
    private String email;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "profile_image", nullable = false, length = 2083)
    private String profileImage;

    @Enumerated(EnumType.STRING)
    @Column(name = "language", nullable = false, length = 3)
    private Language language;

    @Column(name = "certificate_img", length = 2083)
    private String certificateImg;

    public UserEntity() {

    }

}

