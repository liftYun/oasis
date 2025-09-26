package org.muhan.oasis.charging.service;

import lombok.AllArgsConstructor;
import org.muhan.oasis.charging.dto.in.CharingRequestDto;
import org.muhan.oasis.charging.dto.out.ChargingResponseDto;
import org.muhan.oasis.common.exception.BaseException;
import org.muhan.oasis.common.base.BaseResponseStatus;
import org.muhan.oasis.user.entity.UserEntity;
import org.muhan.oasis.user.repository.UserRepository;
import org.muhan.oasis.wallet.entity.WalletEntity;
import org.muhan.oasis.wallet.respository.WalletRepository;
import org.muhan.oasis.web3.Web3Service;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.BigInteger;

@Service
@AllArgsConstructor
public class ChargingService {

    private final WalletRepository walletRepository;
    private final UserRepository userRepository;
    private final Web3Service web3Service;

    public ChargingResponseDto charge(CharingRequestDto dto) throws Exception {

        UserEntity user = userRepository.findByUserUuid(dto.getUserUUID())
                .orElseThrow(() -> new BaseException(BaseResponseStatus.NO_EXIST_USER));

        WalletEntity wallet = walletRepository.findByUser(user);

        if (wallet == null) {
            throw new BaseException(BaseResponseStatus.NO_WALLET);
        }

        String walletAddress = wallet.getAddress();

        BigInteger amount = dto.getUsdc()
                .multiply(BigDecimal.valueOf(1_000_000))
                .toBigIntegerExact();

        String txHash = web3Service.callTopUp(walletAddress, amount);

        return new ChargingResponseDto(txHash, dto.getUsdc());
    }

}
