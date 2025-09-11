// src/main/java/org/muhan/oasis/booking/service/BookingService.java
package org.muhan.oasis.booking.service;

import lombok.RequiredArgsConstructor;
import org.muhan.oasis.booking.UserSessionStore;
import org.muhan.oasis.booking.dto.LockRequest;
import org.muhan.oasis.booking.dto.LockResponse;
import org.muhan.oasis.booking.util.AbiEncoder;
import org.muhan.oasis.circle.CircleAuthService;
import org.muhan.oasis.circle.UserTransactionService;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final CircleAuthService auth;
    private final UserTransactionService userTx;

    public LockResponse createApproveThenLock(LockRequest r) {
        validate(r);

        // 기존: sessionStore.get(...) → NPE
        // 변경: 없으면 자동 발급/조회
        var ses = auth.getOrCreateSession(r.getUserId());

        BigInteger amount = toUSDC(r.getAmountUSDC());
        BigInteger fee    = toUSDC(r.getFeeUSDC());
        BigInteger total  = amount.add(fee);

        // approve: spender = booking
        String approveCid = userTx.createContractExecutionByAbi(
                r.getUserId(), ses.getWalletId(), r.getUsdc(),
                "approve(address,uint256)",
                List.of(r.getBooking(), total.toString())
        );

        // lock: 튜플 복잡 → callData
        String callData = AbiEncoder.encodeLock(
                r.getResId(), r.getHost(), amount, fee, r.getCheckIn(), r.getCheckOut(), r.getPolicy()
        );
        String lockCid = userTx.createContractExecutionByCallData(
                r.getUserId(), ses.getWalletId(), r.getBooking(), callData
        );

        return LockResponse.multi(List.of(
                new LockResponse.Step("approve USDC", approveCid),
                new LockResponse.Step("lock booking", lockCid)
        ));
    }

    private void validate(LockRequest r) {
        if (r.getUserId() == null) throw new IllegalArgumentException("userId required");
        if (r.getUsdc() == null) throw new IllegalArgumentException("usdc required");
        if (r.getBooking() == null) throw new IllegalArgumentException("booking required");
        if (r.getHost() == null) throw new IllegalArgumentException("host required");
        if (r.getAmountUSDC() == null || r.getFeeUSDC() == null) throw new IllegalArgumentException("amount/fee required");
        long now = System.currentTimeMillis()/1000L;
        if (r.getCheckIn() <= now) throw new IllegalArgumentException("checkIn must be in the future");
        if (r.getCheckOut() <= r.getCheckIn()) throw new IllegalArgumentException("checkOut must be greater than checkIn");
        if (r.getPolicy() == null) throw new IllegalArgumentException("policy required");
    }

    private BigInteger toUSDC(String decimalStr) {
        return new BigDecimal(decimalStr).movePointRight(6).toBigIntegerExact();
    }
}
