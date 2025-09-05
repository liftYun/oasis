package org.muhan.oasis.user.entity;

import jakarta.persistence.*;
import lombok.*;
import org.muhan.oasis.common.base.BaseEntity;
import org.muhan.oasis.key.entity.KeyOwnerEntity;
import org.muhan.oasis.reservation.entity.ReservationEntity;
import org.muhan.oasis.review.entity.ReviewEntity;
import org.muhan.oasis.stay.entity.CancellationPolicyEntity;
import org.muhan.oasis.stay.entity.StayEntity;
import org.muhan.oasis.valueobject.Language;
import org.muhan.oasis.valueobject.Role;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "users",
        uniqueConstraints = {
                @UniqueConstraint(name = "uk_users_email", columnNames = "email"),
                @UniqueConstraint(name = "uk_users_nickname", columnNames = "nickname")
        })
@EntityListeners(AuditingEntityListener.class)
@NoArgsConstructor
@Getter
public class UserEntity extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")                     // 서러게이트 PK
    private Long userId;

    @Column(name = "user_uuid", nullable = false, unique = true, updatable = false)
    private String userUuid;                   // 비즈니스 키(사용자 UUID)

    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false, length = 20)
    private Role role;

    @Column(name = "nickname", length = 100, unique = true)
    private String nickname;

    @Column(name = "email", nullable = false, length = 255, unique = true)
    private String email;

    @Column(name = "profile_img", nullable = false, length = 2083)
    private String profileImg;

    @Enumerated(EnumType.STRING)
    @Column(name = "language", nullable = false, length = 3)
    private Language language;

    @Column(name = "certificate_img", length = 2083)
    private String certificateImg;

    @OneToMany(mappedBy = "users")
    private List<WishEntity> wishList = new ArrayList<>();

    /* ---------- 양방향 연관관계들 ---------- */

    // 위시리스트 (users 1 : N wishes)
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<WishEntity> wishes = new ArrayList<>();

    // 내가 올린 숙소 (users 1 : N stays) -> stays.user_id
    @OneToMany(mappedBy = "host", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<StayEntity> stays = new ArrayList<>();

    // 나의 예약 (users 1 : N reservations) -> reservations.user_id (권장)
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ReservationEntity> reservations = new ArrayList<>();

    // 내가 쓴 리뷰 (users 1 : N reviews) -> reviews.user_id
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ReviewEntity> reviews = new ArrayList<>();

    // 내가 소유한(공유받은) 키 (users 1 : N key_owner)
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<KeyOwnerEntity> keyOwners = new ArrayList<>();

    // 나의 취소 정책 (users 1 : 1 cancellation_policies)
    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private CancellationPolicyEntity cancellationPolicy;

    /* ---------- 편의 메서드 ---------- */
//    public void addWish(WishEntity wish) {
//        wishes.add(wish);
//        wish.setUserId(this);
//    }
//    public void removeWish(WishEntity wish) {
//        wishes.remove(wish);
//        wish.setUserId(null);
//    }
//    public void addStay(StayEntity stay) {
//        stays.add(stay);
//        stay.setUser(this);
//    }
//    public void addReservation(ReservationEntity r) {
//        reservations.add(r);
//        r.setUserId(this);
//    }
//    public void addReview(ReviewEntity rv) {
//        reviews.add(rv);
//        rv.setUserId(this);
//    }
//    public void addKeyOwner(KeyOwnerEntity ko) {
//        keyOwners.add(ko);
//        ko.setUserId(this);
//    }

    @Builder
    public UserEntity(String userUuid, Role role, String nickname, String email, String profileImg, Language language, String certificateImg) {
        this.userUuid = userUuid;
        this.role = role;
        this.nickname = nickname;
        this.email = email;
        this.profileImg = profileImg;
        this.language = language;
        this.certificateImg = certificateImg;
    }

}

