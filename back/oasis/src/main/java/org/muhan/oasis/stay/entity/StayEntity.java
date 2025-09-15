package org.muhan.oasis.stay.entity;

import jakarta.persistence.*;
import lombok.*;
import org.muhan.oasis.user.entity.UserEntity;
import org.muhan.oasis.valueobject.Language;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@Entity
@Getter @Setter
@Builder
@NoArgsConstructor
@Table(name = "stays", indexes = {
        @Index(name="idx_stays_user", columnList="user_id"),
        @Index(name="idx_stays_sub", columnList="sub_region_id"),
        @Index(name="idx_stays_sub_eng", columnList="sub_region_eng_id"),
        @Index(name="idx_stays_policy", columnList="cancellation_policy_id")
})
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

        @Column(name = "title", nullable = false)
        private String title;

        @Column(name = "title_eng", nullable = false)
        private String titleEng;

        @Column(name = "description", nullable = false)
        private String description;

        @Column(name = "description_eng", nullable = false)
        private String descriptionEng;

        @Column(name = "price", nullable = false)
        private Integer price;

        @Column(name = "address_line", nullable = false)
        private String addressLine;

        @Column(name = "address_line_eng", nullable = false)
        private String addressLineEng;

        @Column(name = "postal_code", nullable = false)
        private String postalCode;

        @Column(name = "max_guests", nullable = false)
        private Integer maxGuests;

        @CreatedDate
        @Column(name = "created_at", updatable = false)
        private LocalDateTime createdAt;

        @LastModifiedDate
        @Column(name = "updated_at")
        private LocalDateTime updatedAt;

        @Column(name = "thumbnail")
        private String thumbnail;

        @Column(name = "address_detail")
        private String addrDetail;

        @Column(name = "address_detail_eng")
        private String addrDetailEng;

        @Enumerated(EnumType.STRING)
        @Column(name = "language", nullable = false, length = 3)
        private Language language;

        @ManyToOne(fetch = FetchType.LAZY, optional = false)
        @JoinColumn(name = "sub_region_id", nullable = false)
        private SubRegionEntity subRegionEntity;

        @ManyToOne(fetch = FetchType.LAZY, optional = false)
        @JoinColumn(name = "sub_region_eng_id", nullable = false)
        private SubRegionEngEntity subRegionEngEntity;

        @ManyToOne(fetch = FetchType.LAZY, optional = false)
        @JoinColumn(name = "cancellation_policy_id", nullable = false)
        private CancellationPolicyEntity cancellationPolicyEntity;

        @Setter(AccessLevel.NONE)
        @Builder.Default
        @OneToMany(mappedBy = "stay", cascade = CascadeType.ALL, orphanRemoval = true)
        private List<StayFacilityEntity> stayFacilities = new ArrayList<>();

        @Setter(AccessLevel.NONE)
        @Builder.Default
        @OneToMany(mappedBy = "stay", cascade = CascadeType.ALL, orphanRemoval = true)
        private List<StayPhotoEntity> stayPhotoEntities = new ArrayList<>();

        @Setter(AccessLevel.NONE)
        @OneToOne(mappedBy = "stay", cascade = CascadeType.ALL, orphanRemoval = true)
        private DeviceEntity device;

        @Setter(AccessLevel.NONE)
        @OneToOne(mappedBy = "stay", cascade = CascadeType.ALL, orphanRemoval = true)
        private StayRatingSummaryEntity ratingSummary;

        /** 1:1 Device — 소유측(Device)에 FK가 있으므로 양쪽 동기화만 */
        public void attachDevice(DeviceEntity device) {
                this.device = device;
                if (device != null && device.getStay() != this) {
                        device.setStay(this);
                }
        }

        /** 1:1 RatingSummary — @MapsId 사용 시 역시 양쪽 동기화만 */
        public void attachRatingSummary(StayRatingSummaryEntity summary) {
                this.ratingSummary = summary;
                if (summary != null && summary.getStay() != this) {
                        summary.setStay(this);
                }
        }

        /** 1:N StayPhoto — 한 장 추가 */
        public void addPhoto(StayPhotoEntity photo) {
                if (photo == null) return;
                if (!this.stayPhotoEntities.contains(photo)) {
                        this.stayPhotoEntities.add(photo);
                }
                if (photo.getStay() != this) {
                        photo.setStay(this); // 소유측 FK 세팅
                }
        }

        /** 1:N StayPhoto — 여러 장 추가 */
        public void addPhotos(Collection<StayPhotoEntity> photos) {
                if (photos == null || photos.isEmpty()) return;
                photos.forEach(this::addPhoto);
        }

        /** 1:N StayPhoto — 제거(실제 삭제는 repo.delete(photo)로!) */
        public void removePhoto(StayPhotoEntity photo) {
                if (photo == null) return;
                this.stayPhotoEntities.remove(photo);
        }

        /** 1:N StayFacility — 한 개 추가 (연결 엔티티) */
        public void addFacility(StayFacilityEntity sf) {
                if (sf == null) return;
                if (!this.stayFacilities.contains(sf)) {
                        this.stayFacilities.add(sf);
                }
                if (sf.getStay() != this) {
                        sf.setStay(this);
                }
        }

        /** 1:N StayFacility — 여러 개 추가 */
        public void addFacilities(Collection<StayFacilityEntity> list) {
                if (list == null || list.isEmpty()) return;
                list.forEach(this::addFacility);
        }

        /** 1:N StayFacility — 제거(실제 삭제는 repo.delete(sf)로!) */
        public void removeFacility(StayFacilityEntity sf) {
                if (sf == null) return;
                this.stayFacilities.remove(sf);
        }

        public String title(Language lang)       { return lang == Language.KOR ? nvl(title, titleEng) : nvl(titleEng, title); }
        public String description(Language lang) { return lang == Language.KOR ? nvl(description, descriptionEng) : nvl(descriptionEng, description); }
        private static String nvl(String a, String b){ return (a != null && !a.isBlank()) ? a : b; }

}
