package org.muhan.oasis.review.entity;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.muhan.oasis.reservation.entity.ReservationEntity;
import org.muhan.oasis.user.entity.UserEntity;
import org.muhan.oasis.valueobject.Language;
import org.springframework.data.annotation.CreatedDate;

import java.time.LocalDateTime;

@Entity
@Table(name = "reviews")
@NoArgsConstructor
public class ReviewEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "review_id", nullable = false)
    private Long reviewId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reservation_id", nullable = false)
    private ReservationEntity reservationId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity userId;

    @Column(name ="rating", nullable = false)
    private float rating;

    @Column(name ="content")
    private String content;

    @Column(name ="content_eng")
    private String contentEng;

    @Column(name = "original_lang")
    private Language originalLang;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    @Builder
    public ReviewEntity(ReservationEntity reservationId, UserEntity userId, float rating, String content, String contentEng, Language originalLang, LocalDateTime createdAt) {
        this.reservationId = reservationId;
        this.userId = userId;
        this.rating = rating;
        this.content = content;
        this.contentEng = contentEng;
        this.originalLang = originalLang;
        this.createdAt = createdAt;
    }
}
