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
    private DeviceEntity device;   // 도어락 ID (FK)

    @Column(name = "activation_time")
    private LocalDateTime activationTime;

    @Column(name = "expiration_time")
    private LocalDateTime expirationTime;

    @Builder
    public KeyEntity(Long keyId, DeviceEntity device, LocalDateTime activationTime, LocalDateTime expirationTime) {
        this.keyId = keyId;
        this.device = device;
        this.activationTime = activationTime;
        this.expirationTime = expirationTime;
    }

    @PrePersist
    public void prePersist() {
        if (activationTime == null) {
            activationTime = LocalDateTime.now();
        }
    }

    public boolean isValidNow() {
        LocalDateTime now = LocalDateTime.now();

        // 활성화 시간이 설정돼 있고, 아직 도래하지 않았다면 false
        if (activationTime != null && now.isBefore(activationTime)) {
            return false;
        }

        // 만료 시간이 설정돼 있고, 이미 지났다면 false
        if (expirationTime != null && now.isAfter(expirationTime)) {
            return false;
        }

        return true; // 그 외는 유효
    }
}
