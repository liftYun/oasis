package org.muhan.oasis.wallet.entity;

import jakarta.persistence.*;
import lombok.*;
import org.muhan.oasis.user.entity.UserEntity;

@Entity
@Table(name = "wallets")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WalletEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 50)
    private String walletId;   // Circle walletId

    @Column(nullable = false, length = 42)
    private String address;    // EVM address

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity user;

    @Column(nullable = false, length = 20)
    private String blockchain; // MATIC-AMOY, ETH-SEPOLIA 등
}
