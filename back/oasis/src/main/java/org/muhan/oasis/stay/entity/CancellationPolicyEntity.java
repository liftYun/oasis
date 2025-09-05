package org.muhan.oasis.stay.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.*;
import org.hibernate.annotations.DynamicInsert;
import org.muhan.oasis.security.entity.UserEntity;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@DynamicInsert
@Table(name = "cancellation_policies")
@AllArgsConstructor
public class CancellationPolicyEntity {

    @Id
    @Column(name = "cancellation_policy_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_uuid", referencedColumnName = "user_uuid", nullable = false, updatable = false)
    private UserEntity user;

    // 1~3일 전
    @Min(0) @Max(100)
    @Column(name = "policy1", columnDefinition = "TINYINT UNSIGNED DEFAULT 50")
    private Integer policy1;

    // 4~7일 전
    @Min(0) @Max(100)
    @Column(name = "policy2", columnDefinition = "TINYINT UNSIGNED DEFAULT 15")
    private Integer policy2;

    // 8일 전
    @Min(0) @Max(100)
    @Column(name = "policy3", columnDefinition = "TINYINT UNSIGNED DEFAULT 5")
    private Integer policy3;

}
