package org.muhan.oasis.stay.entity;

import jakarta.persistence.*;
import lombok.*;
import org.muhan.oasis.valueobject.Category;

@Entity
@Getter
@Builder
@NoArgsConstructor
@Table(name = "facilities")
@AllArgsConstructor
public class FacilityEntity {
    @Id
    @Column(name = "facilities_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "facilities_name", nullable = false)
    private String name;

    @Column(name = "facilities_name_eng", nullable = false)
    private String nameEng;

    @Column(name = "category", nullable = false)
    @Enumerated(EnumType.STRING)
    private Category category;
}
