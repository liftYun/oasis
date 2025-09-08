package org.muhan.oasis.user.entity;

import jakarta.persistence.*;
import lombok.*;
import org.muhan.oasis.stay.entity.StayEntity;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@Entity
@Getter
@Table(name = "wishes")
@EntityListeners(AuditingEntityListener.class)
@NoArgsConstructor
public class WishEntity {
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        @Column(name = "wish_id")
        private Long wishId;

        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "user_id", nullable = false)
        private UserEntity userId;

        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "stay_id", nullable = false)
        private StayEntity stayId;

        @Builder
        public WishEntity(Long wishId, UserEntity userId, StayEntity stayId) {
                this.wishId = wishId;
                this.userId = userId;
                this.stayId = stayId;
        }
}
