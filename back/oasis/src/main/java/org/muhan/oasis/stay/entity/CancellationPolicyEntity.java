package org.muhan.oasis.stay.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.*;
import org.hibernate.annotations.DynamicInsert;
import org.muhan.oasis.user.entity.UserEntity;

@Entity
@Getter
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

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", referencedColumnName = "user_id", nullable = false, updatable = false)
    private UserEntity user;

    // 전날
    @Min(0) @Max(95)
    @Column(name = "policy1", columnDefinition = "TINYINT UNSIGNED DEFAULT 50")
    private Integer policy1;

    // 3일
    @Min(0) @Max(95)
    @Column(name = "policy2", columnDefinition = "TINYINT UNSIGNED DEFAULT 15")
    private Integer policy2;

    // 5일
    @Min(0) @Max(95)
    @Column(name = "policy3", columnDefinition = "TINYINT UNSIGNED DEFAULT 5")
    private Integer policy3;

    // 7알
    @Min(0) @Max(95)
    @Column(name = "policy4", columnDefinition = "TINYINT UNSIGNED DEFAULT 0")
    private Integer policy4;

}
