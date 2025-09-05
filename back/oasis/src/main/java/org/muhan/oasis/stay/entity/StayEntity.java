package org.muhan.oasis.stay.entity;

import jakarta.persistence.*;
import lombok.*;
import org.muhan.oasis.security.entity.UserEntity;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@Table(name = "stays")
@EntityListeners(AuditingEntityListener.class)
@AllArgsConstructor
public class StayEntity {
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        @Column(name = "stay_id")
        private Long id;

        @ManyToOne(fetch = FetchType.LAZY, optional = false)
        @JoinColumn(name = "user_id", nullable = false, updatable = false)
        private UserEntity user;

        @Column(name = "title")
        private String title;

        @Column(name = "title_eng")
        private String titleEng;

        @Column(name = "description")
        private String description;

        @Column(name = "description_eng")
        private String descriptionEng;

        @Column(name = "price")
        private Integer price;

        @Column(name = "address_line")
        private String addressLine;

        @Column(name = "address_line_eng")
        private String addressLineEng;

        @Column(name = "postal_code")
        private String postalCode;

        @Column(name = "max_guests")
        private Integer maxGuests;

        @CreatedDate
        @Column(name = "created_at")
        private LocalDateTime createdAt;

        @LastModifiedDate
        @Column(name = "updated_at")
        private LocalDateTime updatedAt;

        @Column(name = "thumbnail")
        private String thumbnail;

        @ManyToOne(fetch = FetchType.LAZY, optional = false)
        @JoinColumn(name = "sub_region_id", nullable = false, updatable = false)
        private SubRegionEntity subRegionEntity;

        @ManyToOne(fetch = FetchType.LAZY, optional = false)
        @JoinColumn(name = "sub_region_eng_id", nullable = false, updatable = false)
        private SubRegionEngEntity subRegionEngEntity;

        @ManyToOne(fetch = FetchType.LAZY, optional = false)
        @JoinColumn(name = "cancellation_policy_id", nullable = false, updatable = false)
        private CancellationPolicyEntity cancellationPolicyEntity;

        @Setter(AccessLevel.NONE)
        @Builder.Default
        @OneToMany(mappedBy = "stay", cascade = CascadeType.ALL, orphanRemoval = true)
        private List<StayFacilityEntity> stayFacilities = new ArrayList<>();

        @Setter(AccessLevel.NONE)
        @Builder.Default
        @OneToMany(mappedBy = "stay", cascade = CascadeType.ALL, orphanRemoval = true)
        private List<StayPhotoEntity> stayPhotoEntities = new ArrayList<>();

        @OneToOne(mappedBy = "stay", cascade = CascadeType.ALL, orphanRemoval = true)
        private DeviceEntity device;

        @OneToOne(mappedBy = "stay", cascade = CascadeType.ALL, orphanRemoval = true)
        private StayRatingSummaryEntity ratingSummary;
}
