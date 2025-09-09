package org.muhan.oasis.stay.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@Table(name = "devices")
@AllArgsConstructor
public class DeviceEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "device_id")
    private Long id;

    @Column(name = "stay_name", nullable = false)
    private String stayName;

    @Column(name = "stay_name_eng", nullable = false)
    private String stayNameEng;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "stay_id", nullable = false, unique = true)
    private StayEntity stay;
}
