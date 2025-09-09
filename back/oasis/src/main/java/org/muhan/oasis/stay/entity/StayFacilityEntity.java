package org.muhan.oasis.stay.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@Table(uniqueConstraints = @UniqueConstraint(name="uk_stay_facility", columnNames={"stay_id","facilities_id"}))
@EntityListeners(AuditingEntityListener.class)
@AllArgsConstructor
public class StayFacilityEntity {

    @Id
    @Column(name = "stay_facilities_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "stay_id", nullable = false)
    private StayEntity stay;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "facilities_id", nullable = false)
    private FacilityEntity facility;

}
