package org.muhan.oasis.stay.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import lombok.*;

@Entity
@Table(name = "stay_photos", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"stay_id", "sort_order"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = {"id"})
@Builder
public class StayPhotoEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ToString.Exclude
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "stay_id", nullable = false)
    private StayEntity stay;

    @Column(name = "sort_order", nullable = false)
    @Min(1)
    private int sortOrder;

    @Column(name = "url", length = 2083, nullable = false)
    private String url;
}
