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
    @Column(name = "stay_id")
    private Long id;

    @Column(name = "device_id", nullable = false)
    private Long deviceId;

    @Column(name = "stay_name", nullable = false)
    private String stayName;

    @Column(name = "stay_name_eng", nullable = false)
    private String stayNameEng;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @MapsId
    @JoinColumn(name = "stay_id")
    private StayEntity stay;
}
