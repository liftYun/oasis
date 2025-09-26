package org.muhan.oasis.key.entity;

import jakarta.persistence.*;
import lombok.*;
import org.muhan.oasis.reservation.entity.ReservationEntity;
import org.muhan.oasis.user.entity.UserEntity;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@Entity
@Getter
@Table(name = "key_owner")
@IdClass(KeyOwnerId.class)
@EntityListeners(AuditingEntityListener.class)
@NoArgsConstructor
public class KeyOwnerEntity {
    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "key_id", nullable = false)
    private KeyEntity key;

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reservation_id")
    private ReservationEntity reservation;


    @Builder
    public KeyOwnerEntity(KeyEntity key, ReservationEntity reservation, UserEntity user) {
        this.key = key;
        this.reservation = reservation;
        this.user = user;
    }
}
