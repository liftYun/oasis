package org.muhan.oasis.stay.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Builder
@NoArgsConstructor
@Table(name = "sub_region")
@AllArgsConstructor
public class SubRegionEntity {

    @Id
    @Column(name = "sub_region_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "sub_name", nullable = false)
    private String subName;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "upper_name", referencedColumnName = "name", nullable = false)
    private RegionEntity region;

}
