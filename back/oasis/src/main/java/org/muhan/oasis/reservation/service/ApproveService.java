package org.muhan.oasis.reservation.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.muhan.oasis.common.base.BaseResponseStatus;
import org.muhan.oasis.common.exception.BaseException;
import org.muhan.oasis.external.circle.CircleUserApi;
import org.muhan.oasis.external.circle.CircleUserTokenCache;
import org.muhan.oasis.reservation.dto.in.ApproveRequestDto;
import org.muhan.oasis.reservation.dto.in.TransactionConfirmRequestDto;
import org.muhan.oasis.reservation.entity.ReservationEntity;
import org.muhan.oasis.reservation.enums.ReservationStatus;
import org.muhan.oasis.reservation.repository.ReservationRepository;
import org.muhan.oasis.user.entity.UserEntity;
import org.muhan.oasis.user.repository.UserRepository;
import org.muhan.oasis.wallet.entity.WalletEntity;
import org.muhan.oasis.wallet.respository.WalletRepository;
import org.muhan.oasis.web3.CallDataEncoder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.math.BigDecimal;
import java.math.BigInteger;

@Service
@RequiredArgsConstructor
@Slf4j
public class ApproveService {

    private final CircleUserApi circle;
    private final CircleUserTokenCache cache;
    private final WalletRepository walletRepository;
    private final UserRepository userRepository;
    private final ReservationRepository reservationRepository;


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
            throw new BaseException(BaseResponseStatus.NO_EXIST_USER);
        }

        UserEntity user = userRepository.findByUserUuid(req.getUserUUID())
                .orElseThrow(() -> new BaseException(BaseResponseStatus.NO_EXIST_USER));

        // DB 상태 검증: PENDING 상태인지 확인
        ReservationEntity reservation = reservationRepository.findByUserAndReservationId(user, req.getReservationId())
                .orElseThrow(() -> new BaseException(BaseResponseStatus.NO_EXIST_RESERVATION));

        WalletEntity wallet = walletRepository.findByUser(user);
        String walletId = wallet.getWalletId();
        BigInteger amount = req.getAmountUSDC().multiply(BigDecimal.TEN.pow(6)).toBigIntegerExact();
        BigInteger fee    = req.getFeeUSDC().multiply(BigDecimal.TEN.pow(6)).toBigIntegerExact();
        BigInteger totalUSDC  = amount.add(fee);
        log.debug("Parsed amount={}, fee={}, totalUSDC={}", amount, fee, totalUSDC);

        CircleUserTokenCache.Entry tokenEntry = circle.ensureUserToken(req.getUserUUID());
        log.debug("User token acquired for userId={}", req.getUserUUID());

        log.info(">>> contractAddress(spender)={}",
                contractAddress);

        String callData = CallDataEncoder.encodeApprove(contractAddress, totalUSDC);

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

            reservation.setStatus(ReservationStatus.PENDING_APPROVED);
            reservation.setChallengeId(ch.getData().getChallengeId());
            reservationRepository.save(reservation);


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
            throw new BaseException(BaseResponseStatus.CIRCLE_INTERNAL_ERROR);

        }
    }

    public void confirmApprove(TransactionConfirmRequestDto request) {
        ReservationEntity reservation = reservationRepository
                .findByChallengeId(request.getChallengeId())
                .orElseThrow(() -> new BaseException(BaseResponseStatus.NO_EXIST_RESERVATION));

        if (request.isSuccess()) {
            reservation.setStatus(ReservationStatus.APPROVED);
            log.info("Approve 트랜잭션 성공 확인: challengeId={}", request.getChallengeId());
        } else if (request.isFailed()) {
            reservation.setStatus(ReservationStatus.PENDING); // Approve 실패 시 PENDING으로 롤백
            log.warn("Approve 트랜잭션 실패 확인: challengeId={}", request.getChallengeId());
        } else {
            log.error("알 수 없는 트랜잭션 상태: status={}", request.getStatus());
            throw new BaseException(BaseResponseStatus.INVALID_PARAMETER);
        }

        reservationRepository.save(reservation);
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
}