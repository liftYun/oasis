package org.muhan.oasis.wallet.respository;

import org.muhan.oasis.user.entity.UserEntity;
import org.muhan.oasis.wallet.entity.WalletEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WalletRepository extends JpaRepository<WalletEntity, Long> {
    WalletEntity findByUser(UserEntity user);
    WalletEntity findByWalletId(String walletId);
    // ✅ walletId 중복 체크
    boolean existsByWalletId(String walletId);

    // 필요시: address 중복 체크
    boolean existsByAddress(String address);

}
