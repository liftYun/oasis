package org.muhan.oasis.stay.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.DynamicInsert;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Builder
@DynamicInsert
@NoArgsConstructor
@EntityListeners(AuditingEntityListener.class)
@Table(name = "stay_rating_summary")
@AllArgsConstructor
public class StayRatingSummaryEntity {
    @Id
    @Column(name = "stay_id")
    private Long id;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @MapsId
    @JoinColumn(name = "stay_id")
    private StayEntity stay;

    @Column(name = "rating_cnt", nullable = false, columnDefinition = "INT DEFAULT 0")
    private Integer ratingCnt;

    @Column(name = "rating_sum", nullable = false, columnDefinition = "INT DEFAULT 0")
    private Integer ratingSum;

    @Column(name = "avg_rating", precision = 2, scale = 1, nullable = false,
            columnDefinition = "DECIMAL(2,1) DEFAULT 0.0")
    private BigDecimal avgRating;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Lob
    @Column(name = "high_rate_summary")
    private String highRateSummary;

    @Lob
    @Column(name = "high_rate_summary_eng")
    private String highRateSummaryEng;

    @Lob
    @Column(name = "low_rate_summary")
    private String lowRateSummary;

    @Lob
    @Column(name = "low_rate_summary_eng")
    private String lowRateSummaryEng;

}
