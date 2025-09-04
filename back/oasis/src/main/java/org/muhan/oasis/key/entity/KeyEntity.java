package org.muhan.oasis.key.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "digital_key")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class KeyEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "key_id")
    private Long keyId;

    @Column(name = "device_id", nullable = false)
    private Long deviceId;   // 도어락 ID (FK)

    @Column(name = "activation_time")
    private LocalDateTime activationTime;

    @Column(name = "expiration_time")
    private LocalDateTime expirationTime;

    @PrePersist
    public void prePersist() {
        if (activationTime == null) {
            activationTime = LocalDateTime.now();
        }
        if (expirationTime == null) {
            expirationTime = activationTime.plusDays(1); // 기본 만료시간: 1일 뒤
        }
    }
}
