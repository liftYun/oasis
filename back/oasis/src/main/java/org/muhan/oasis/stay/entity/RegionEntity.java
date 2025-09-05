package org.muhan.oasis.stay.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@Table(name = "region")
@AllArgsConstructor
public class RegionEntity {

    @Id
    @Column(name = "name")
    private String name;

    @OneToMany(mappedBy = "region", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<SubRegionEntity> subRegions = new ArrayList<>();
}
