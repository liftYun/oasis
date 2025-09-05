package org.muhan.oasis.reservation.entity;

import jakarta.persistence.*;
import lombok.*;
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
    @Column(name = "reservation_id")
    private String reservationId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity userId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "stay_id", nullable = false)
    private StayEntity stayId;

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

    @Column(name = "is_cancled", nullable = false)
    private boolean isCancled;

    @Column(name = "stay_title", nullable = false)
    private String stayTitle;

    @Column(name = "stay_title_eng", nullable = false)
    private String stayTitleEng;
    @Builder
    public ReservationEntity(String reservationId, UserEntity userId, StayEntity stayId, LocalDateTime checkinDate, LocalDateTime checkoutDate, LocalDateTime reservationDate, boolean isSettlemented, boolean isReviewed, int payment, boolean isCancled, String stayTitle, String stayTitleEng) {
        this.reservationId = reservationId;
        this.userId = userId;
        this.stayId = stayId;
        this.checkinDate = checkinDate;
        this.checkoutDate = checkoutDate;
        this.reservationDate = reservationDate;
        this.isSettlemented = isSettlemented;
        this.isReviewed = isReviewed;
        this.payment = payment;
        this.isCancled = isCancled;
        this.stayTitle = stayTitle;
        this.stayTitleEng = stayTitleEng;
    }
}
