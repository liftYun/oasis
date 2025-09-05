package org.muhan.oasis.key.entity;

import jakarta.persistence.*;
import lombok.*;
import org.muhan.oasis.reservation.entity.ReservationEntity;
import org.muhan.oasis.user.entity.UserEntity;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@Entity
@Getter
@Table(name = "key_owner")
@EntityListeners(AuditingEntityListener.class)
@NoArgsConstructor
public class KeyOwnerEntity {
    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "key_id", nullable = false)
    private KeyEntity keyId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reservation_id", nullable = false)
    private ReservationEntity reservationId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity userId;

    public KeyOwnerEntity(KeyEntity keyId, ReservationEntity reservationId, UserEntity userId) {
        this.keyId = keyId;
        this.reservationId = reservationId;
        this.userId = userId;
    }
}
