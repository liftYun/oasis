package org.muhan.oasis.reservation.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.muhan.oasis.external.circle.CircleUserApi;
import org.muhan.oasis.external.circle.CircleUserTokenCache;
import org.muhan.oasis.reservation.dto.in.LockRequestDto;
import org.muhan.oasis.stay.entity.CancellationPolicyEntity;
import org.muhan.oasis.stay.entity.StayEntity;
import org.muhan.oasis.stay.repository.CancellationPolicyRepository;
import org.muhan.oasis.stay.repository.StayRepository;
import org.muhan.oasis.user.entity.UserEntity;
import org.muhan.oasis.user.repository.UserRepository;
import org.muhan.oasis.wallet.entity.WalletEntity;
import org.muhan.oasis.wallet.respository.WalletRepository;
import org.muhan.oasis.web3.CallDataEncoder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.web3j.abi.datatypes.StaticStruct;
import org.web3j.abi.datatypes.generated.Uint16;
import org.web3j.abi.datatypes.generated.Uint32;

import java.math.BigDecimal;
import java.math.BigInteger;

@Service
@RequiredArgsConstructor
@Slf4j
public class LockService {

    private final CircleUserApi circle;
    private final StayRepository stayRepository;
    private final CancellationPolicyRepository cancellationPolicyRepository;
    private final WalletRepository walletRepository;
    private final UserRepository userRepository;


    @Value("${circle.default-fee-level:MEDIUM}")
    private String defaultFeeLevel;

    @Value("${contract.address}")
    private String contractAddress;

    public Result createLock(LockRequestDto req) {
        log.info("=== [createLock] START ===");
        log.info("Request: userId={}, stayId={}, resId={}, amountUSDC={}, feeUSDC={}, checkIn={}, checkOut={}",
                req.getUserUUID(), req.getStayId(), req.getReservationId(),
                req.getAmountUSDC(), req.getFeeUSDC(), req.getCheckIn(), req.getCheckOut());

        validateInputs(req);

        CircleUserTokenCache.Entry tokenEntry = circle.ensureUserToken(req.getUserUUID());

        log.debug("UserToken acquired: {}", tokenEntry.getUserToken());

        UserEntity client = userRepository.findByUserUuid(req.getUserUUID())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 UUID 입니다."));
        WalletEntity clientWallet = walletRepository.findByUser(client);
        String clientWalletId = clientWallet.getWalletId();

        StayEntity stay = stayRepository.findStayWithPolicy(req.getStayId());
        UserEntity host = stay.getUser();
        CancellationPolicyEntity cancellationPolicy = cancellationPolicyRepository.findByStayId(req.getStayId());

        WalletEntity hostWallet = walletRepository.findByUser(host);
        String hostWalletAddress = hostWallet.getAddress();
        if (!StringUtils.hasText(hostWalletAddress) || !hostWalletAddress.startsWith("0x") || hostWalletAddress.length() != 42)
            throw new IllegalArgumentException("host must be 0x-prefixed EVM address");

        BigInteger amount = req.getAmountUSDC().multiply(BigDecimal.TEN.pow(6)).toBigIntegerExact();
        BigInteger fee    = req.getFeeUSDC().multiply(BigDecimal.TEN.pow(6)).toBigIntegerExact();

        StaticStruct policy = new StaticStruct(
                new Uint32(BigInteger.valueOf(604800)),  // before1: 7일
                new Uint32(BigInteger.valueOf(432000)),  // before2: 5일
                new Uint32(BigInteger.valueOf(172800)),  // before3: 2일
                new Uint32(BigInteger.valueOf(86400)),   // before4: 1일
                new Uint16(BigInteger.valueOf(cancellationPolicy.getPolicy1() * 100)),
                new Uint16(BigInteger.valueOf(cancellationPolicy.getPolicy2() * 100)),
                new Uint16(BigInteger.valueOf(cancellationPolicy.getPolicy3() * 100)),
                new Uint16(BigInteger.valueOf(cancellationPolicy.getPolicy4() * 100)),
                new Uint16(BigInteger.valueOf(0)),
                new Uint16(BigInteger.valueOf(cancellationPolicy.getPolicy1() * 100)),
                new Uint16(BigInteger.valueOf(cancellationPolicy.getPolicy2() * 100)),
                new Uint16(BigInteger.valueOf(cancellationPolicy.getPolicy3() * 100)),
                new Uint16(BigInteger.valueOf(cancellationPolicy.getPolicy4() * 100)),
                new Uint16(BigInteger.valueOf(0))
        );

        log.debug("StaticStruct policy constructed: {}", policy);

        String callData = CallDataEncoder.encodeLock(
                req.getReservationId(),
                hostWalletAddress,
                amount,
                fee,
                req.getCheckIn(),
                req.getCheckOut(),
                policy
        );

        String feeLevel = StringUtils.hasText(defaultFeeLevel) ? defaultFeeLevel : "MEDIUM";

        try {
            log.info("Calling Circle API to create contract exec challenge...");
            CircleUserApi.ContractExecChallenge ch = circle.createContractExecChallenge(
                    tokenEntry.getUserToken(),
                    clientWalletId,
                    contractAddress,
                    callData,
                    feeLevel,
                    "lock:" + req.getReservationId()
            );
            log.info("Circle API success: challengeId={}", ch.getData().getChallengeId());
            return new Result(
                    ch.getData().getChallengeId(),
                    tokenEntry.getUserToken(),
                    tokenEntry.getEncryptionKey()
            );

        } catch (CircleUserApi.CircleApiException ex) {
            log.error("=== Circle API Error Details ===");
            log.error("Status: {}", ex.status);
            log.error("Body: {}", ex.body);
            log.error("================================");
            if (shouldRefreshUserToken(ex)) {
                log.warn("User token expired/invalid. Refreshing and retrying once...");
                CircleUserTokenCache.Entry refreshed = circle.ensureUserToken(req.getUserUUID());
                CircleUserApi.ContractExecChallenge ch2 = circle.createContractExecChallenge(
                        refreshed.getUserToken(),
                        clientWalletId,
                        contractAddress,
                        callData,
                        feeLevel,
                        "lock:" + req.getReservationId()
                );
                return new Result(
                        ch2.getData().getChallengeId(),
                        refreshed.getUserToken(),
                        refreshed.getEncryptionKey()
                );
            }
            throw new LockCreateException(
                    500, "circle create transaction failed", "circle error: " + ex.getMessage()
            );
        } catch (RuntimeException ex) {
            throw new LockCreateException(500, "circle create transaction failed", ex.getMessage());
        }
    }

    public record Result(String challengeId, String userToken, String encryptionKey) {}

    private static void validateInputs(LockRequestDto req) {
        if (!StringUtils.hasText(req.getUserUUID())) throw new IllegalArgumentException("userId is required");

        if (!StringUtils.hasText(req.getReservationId()) || !isHex32(req.getReservationId()))
            throw new IllegalArgumentException("resId must be 0x + 32-byte hex string");
        if (req.getCheckIn() <= 0 || req.getCheckOut() <= 0 || req.getCheckIn() >= req.getCheckOut())
            throw new IllegalArgumentException("checkIn/checkOut are invalid");
    }

    private static boolean isHex32(String hex) {
        String h = hex.startsWith("0x") ? hex.substring(2) : hex;
        return h.length() == 64 && h.matches("^[0-9a-fA-F]+$");
    }

    private static boolean shouldRefreshUserToken(CircleUserApi.CircleApiException ex) {
        if (ex.status != 403) return false;
        String body = ex.body == null ? "" : ex.body;
        String lower = body.toLowerCase();
        return body.contains("\"155104\"")
                || body.contains("\"155105\"")
                || lower.contains("user token had expired")
                || lower.contains("usertoken had expired");
    }

    public static class LockCreateException extends RuntimeException {
        public final int status;
        public final String messageForUser;
        public final String result;
        public LockCreateException(int status, String messageForUser, String result) {
            super(messageForUser + " - " + result);
            this.status = status;
            this.messageForUser = messageForUser;
            this.result = result;
        }
    }
}
