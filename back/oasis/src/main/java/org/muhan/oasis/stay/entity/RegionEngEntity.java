package org.muhan.oasis.stay.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Builder
@NoArgsConstructor
@Table(name = "region_eng")
@AllArgsConstructor
public class RegionEngEntity {

    @Id
    @Column(name = "name")
    private String name;

    @OneToMany(mappedBy = "region", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<SubRegionEngEntity> subRegionsEng = new ArrayList<>();
}
