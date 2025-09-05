package org.muhan.oasis.key.entity;

import jakarta.persistence.*;
import lombok.*;
import org.muhan.oasis.stay.entity.DeviceEntity;

import java.time.LocalDateTime;

@Entity
@Table(name = "digital_key")
@Getter
@NoArgsConstructor
public class KeyEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "key_id")
    private Long keyId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "device_id", nullable = false)
    private DeviceEntity deviceId;   // 도어락 ID (FK)

    @Column(name = "activation_time")
    private LocalDateTime activationTime;

    @Column(name = "expiration_time")
    private LocalDateTime expirationTime;

    @Builder
    public KeyEntity(Long keyId, DeviceEntity deviceId, LocalDateTime activationTime, LocalDateTime expirationTime) {
        this.keyId = keyId;
        this.deviceId = deviceId;
        this.activationTime = activationTime;
        this.expirationTime = expirationTime;
    }

    @PrePersist
    public void prePersist() {
        if (activationTime == null) {
            activationTime = LocalDateTime.now();
        }
    }
}
