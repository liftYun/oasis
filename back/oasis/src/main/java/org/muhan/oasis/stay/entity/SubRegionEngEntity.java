package org.muhan.oasis.stay.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@Table(name = "sub_region_eng")
@AllArgsConstructor
public class SubRegionEngEntity {

    @Id
    @Column(name = "sub_region_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "sub_name", nullable = false)
    private String subName;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "upper_name", referencedColumnName = "name", nullable = false)
    private RegionEngEntity region;

}