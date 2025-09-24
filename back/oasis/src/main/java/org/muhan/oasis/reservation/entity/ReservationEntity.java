package org.muhan.oasis.reservation.entity;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.muhan.oasis.reservation.enums.ReservationStatus;
import org.muhan.oasis.stay.entity.StayEntity;
import org.muhan.oasis.user.entity.UserEntity;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Getter
@Table(name = "reservations")
@EntityListeners(AuditingEntityListener.class)
@NoArgsConstructor
public class ReservationEntity {
    @Id
    @Column(name = "reservation_id", length = 191, nullable = false)
    private String reservationId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "stay_id", nullable = false)
    private StayEntity stay;

    @Column(name = "checkin_date", nullable = false)
    private LocalDateTime checkinDate;

    @Column(name = "checkout_date", nullable = false)
    private LocalDateTime checkoutDate;

    @CreatedDate
    @Column(name = "reservation_date", nullable = false)
    private LocalDateTime reservationDate;

    @Column(name = "is_settlemented", nullable = false)
    private boolean isSettlemented;

    @Column(name = "is_reviewed", nullable = false)
    private boolean isReviewed;

    @Column(name = "payment", nullable = false)
    private int payment;

    @Column(name = "is_canceled", nullable = false)
    private boolean isCanceled;

    @Column(name = "stay_title", nullable = false)
    private String stayTitle;

    @Column(name = "stay_title_eng", nullable = false)
    private String stayTitleEng;

    @Column(name = "status", length = 50, nullable = false)
    @Enumerated(EnumType.STRING)
    private ReservationStatus status; // 상태 관리를 위한 ENUM 타입 필드

    @Column(name = "challenge_id", length = 191)
    private String challengeId; // Circle 트랜잭션 추적을 위한 ID

    @Builder
    public ReservationEntity(String reservationId, UserEntity user, StayEntity stay, LocalDateTime checkinDate, LocalDateTime checkoutDate, LocalDateTime reservationDate, boolean isSettlemented, boolean isReviewed, int payment, boolean isCanceled, String stayTitle, String stayTitleEng,
                             ReservationStatus status, String challengeId) {
        this.reservationId = reservationId;
        this.user = user;
        this.stay = stay;
        this.checkinDate = checkinDate;
        this.checkoutDate = checkoutDate;
        this.reservationDate = reservationDate;
        this.isSettlemented = isSettlemented;
        this.isReviewed = isReviewed;
        this.payment = payment;
        this.isCanceled = isCanceled;
        this.stayTitle = stayTitle;
        this.stayTitleEng = stayTitleEng;
        this.status = status; // 값 할당
        this.challengeId = challengeId;
    }

    public String getThumbnail(){
        return this.getStay().getThumbnail();
    }
    public void setStatus(ReservationStatus status) {
        this.status = status;
    }

    public void setChallengeId(String challengeId) {
        this.challengeId = challengeId;
    }
}
