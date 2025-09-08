package org.muhan.oasis.review.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.muhan.oasis.reservation.entity.ReservationEntity;
import org.muhan.oasis.user.entity.UserEntity;
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
    private String content_eng;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    public ReviewEntity(Long reviewId, ReservationEntity reservationId, UserEntity userId, float rating, String content, String content_eng, LocalDateTime createdAt) {
        this.reviewId = reviewId;
        this.reservationId = reservationId;
        this.userId = userId;
        this.rating = rating;
        this.content = content;
        this.content_eng = content_eng;
        this.createdAt = createdAt;
    }
}
