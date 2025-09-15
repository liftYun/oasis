package org.muhan.oasis.reservation.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.muhan.oasis.external.circle.CircleUserApi;
import org.muhan.oasis.external.circle.CircleUserTokenCache;
import org.muhan.oasis.reservation.dto.in.ApproveRequestDto;
import org.muhan.oasis.user.entity.UserEntity;
import org.muhan.oasis.user.repository.UserRepository;
import org.muhan.oasis.wallet.entity.WalletEntity;
import org.muhan.oasis.wallet.respository.WalletRepository;
import org.muhan.oasis.web3.CallDataEncoder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.math.BigInteger;

@Service
@RequiredArgsConstructor
@Slf4j
public class ApproveService {

    private final CircleUserApi circle;
    private final CircleUserTokenCache cache;
    private final WalletRepository walletRepository;
    private final UserRepository userRepository;


    @Value("${usdc.address}")
    private String usdcAddress; // Polygon Amoy USDC

    @Value("${contract.address}")
    private String contractAddress;

    @Value("${circle.default-fee-level:MEDIUM}")
    private String defaultFeeLevel;

    public Result createApprove(ApproveRequestDto req) {
        log.info(">>> createApprove called. UUID={}, amountUSDC={}, feeUSDC={}",
                req.getUserUUID(), req.getAmountUSDC(), req.getFeeUSDC());

        if (!StringUtils.hasText(req.getUserUUID())) {
            throw new IllegalArgumentException("userId is required");
        }

        if (!StringUtils.hasText(req.getAmountUSDC())) {
            throw new IllegalArgumentException("amountUSDC is required");
        }

        if (!StringUtils.hasText(req.getFeeUSDC())) {
            throw new IllegalArgumentException("feeUSDC is required");
        }


        UserEntity user = userRepository.findByUserUuid(req.getUserUUID())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 UUID 입니다."));
        WalletEntity wallet = walletRepository.findByUser(user);
        String walletId = wallet.getWalletId();
        BigInteger amount = new BigInteger(req.getAmountUSDC().trim());
        BigInteger fee    = new BigInteger(req.getFeeUSDC().trim());
        BigInteger totalUSDC  = amount.add(fee);
        log.debug("Parsed amount={}, fee={}, totalUSDC={}", amount, fee, totalUSDC);

        CircleUserTokenCache.Entry tokenEntry = circle.ensureUserToken(req.getUserUUID());
        log.debug("User token acquired for userId={}", req.getUserUUID());

        log.info(">>> contractAddress(spender)={}",
                contractAddress);

        String callData = CallDataEncoder.encodeApprove(contractAddress, req.getAmountUSDC(), req.getFeeUSDC());

        log.debug("Encoded approve callData={}", callData);
        String feeLevel = StringUtils.hasText(defaultFeeLevel) ? defaultFeeLevel : "MEDIUM";

        log.info(">>> USDC Address: {}", usdcAddress);
        log.info(">>> Contract Address: {}", contractAddress);
        log.info(">>> WalletId: {}", walletId);
        try {
            CircleUserApi.ContractExecChallenge ch = circle.createContractExecChallenge(
                    tokenEntry.getUserToken(),
                    walletId,
                    usdcAddress,
                    callData,
                    feeLevel,
                    "approve:" + totalUSDC
            );

            log.info("Approve challenge created successfully. challengeId={}", ch.getData().getChallengeId());


            return new Result(ch.getData().getChallengeId(),
                    tokenEntry.getUserToken(),
                    tokenEntry.getEncryptionKey());

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
                        walletId,
                        usdcAddress,
                        callData,
                        feeLevel,
                        "approve:" + totalUSDC
                );
                return new Result(ch2.getData().getChallengeId(),
                        refreshed.getUserToken(),
                        refreshed.getEncryptionKey());
            }
            throw new ApproveCreateException(
                    500, "circle approve transaction failed", "circle error: " + ex.getMessage()
            );
        }
    }

    public record Result(String challengeId, String userToken, String encryptionKey) {}

    private static boolean shouldRefreshUserToken(CircleUserApi.CircleApiException ex) {
        if (ex.status != 403) return false;
        String body = ex.body == null ? "" : ex.body;
        String lower = body.toLowerCase();
        return body.contains("\"155104\"")
                || body.contains("\"155105\"")
                || lower.contains("user token had expired")
                || lower.contains("usertoken had expired");
    }

    public static class ApproveCreateException extends RuntimeException {
        public final int status;
        public final String messageForUser;
        public final String result;

        public ApproveCreateException(int status, String messageForUser, String result) {
            super(messageForUser + " - " + result);
            this.status = status;
            this.messageForUser = messageForUser;
            this.result = result;
        }
    }
}