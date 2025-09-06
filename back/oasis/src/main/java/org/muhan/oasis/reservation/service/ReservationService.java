package org.muhan.oasis.reservation.service;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.muhan.oasis.reservation.dto.in.CreateReservationRequestDto;
import org.muhan.oasis.reservation.dto.out.BookingResponse;
import org.muhan.oasis.reservation.entity.Reservation;
import org.muhan.oasis.reservation.repository.ReservationRepository;
import org.muhan.oasis.reservation.vo.in.ExecuteReservationRequestVo;
import org.muhan.oasis.reservation.vo.in.RecordReservationRequest;
import org.muhan.oasis.reservation.vo.out.BookingResponseVo;
import org.muhan.oasis.web3.service.Web3Service;
import org.springframework.stereotype.Service;
import org.web3j.abi.FunctionEncoder;
import org.web3j.abi.FunctionReturnDecoder;
import org.web3j.abi.TypeReference;
import org.web3j.abi.datatypes.Address;
import org.web3j.abi.datatypes.Function;
import org.web3j.abi.datatypes.StaticStruct;
import org.web3j.abi.datatypes.Type;
import org.web3j.abi.datatypes.generated.*;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.core.DefaultBlockParameterName;
import org.web3j.protocol.core.methods.request.Transaction;
import org.web3j.protocol.core.methods.response.EthCall;
import org.web3j.utils.Numeric;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.Arrays;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReservationService {
    private final Web3Service web3Service;
    private final ReservationRepository reservationRepository;
    private static final SecureRandom RNG = new SecureRandom();


    // 네가 쓰고 있는 주소 그대로
    private static final String CONTRACT_ADDRESS = "0x42106dd5fae320c77de6ba756b9979a7339a203a";
    private static final int USDC_DECIMALS = 6;


//    private static String newResIdHex32() {
//        byte[] buf = new byte[32];
//        RNG.nextBytes(buf);
//        return Numeric.toHexString(buf);
//    }
//
//    @Transactional
//    public String executeReservation(ExecuteReservationRequestVo request) {
//        try {
//            // resId는 서버/DB 용도
//            String resId = newResIdHex32();
//
//            CreateReservationRequestDto dto = CreateReservationRequestDto.builder()
//                    .resId(resId)
//                    .guestAddress(request.getGuestAddress())
//                    .hostAddress(request.getHostAddress())
//                    .amount(request.getPayment())
//                    .fee(request.getFee() != null ? request.getFee() : BigInteger.ZERO)
//                    .checkInTimestamp(request.getCheckInTimestamp())
//                    .checkOutTimestamp(request.getCheckOutTimestamp())
//                    .policyBefore1(request.getPolicyBefore1())
//                    .policyBefore2(request.getPolicyBefore2())
//                    .policyAmtPct1(request.getPolicyAmtPct1())
//                    .policyAmtPct2(request.getPolicyAmtPct2())
//                    .policyAmtPct3(request.getPolicyAmtPct3())
//                    .policyFeePct1(request.getPolicyFeePct1())
//                    .policyFeePct2(request.getPolicyFeePct2())
//                    .policyFeePct3(request.getPolicyFeePct3())
//                    .build();
//
//            String txHash = web3Service.createBooking(dto);
//
//            Reservation reservation = Reservation.builder()
//                    .reservationId(resId)
//                    .payment(request.getPayment())
//                    .checkinDate(LocalDateTime.ofInstant(Instant.ofEpochSecond(request.getCheckInTimestamp()), ZoneOffset.UTC))
//                    .checkoutDate(LocalDateTime.ofInstant(Instant.ofEpochSecond(request.getCheckOutTimestamp()), ZoneOffset.UTC))
//                    .reservation_date(LocalDate.now())
//                    .build();
//            reservationRepository.save(reservation);
//
//            return txHash;
//        } catch (Exception e) {
//            throw new RuntimeException("Blockchain reservation failed: " + e.getMessage(), e);
//        }
//    }

    private static void requireHex66(String hex, String label) {
        if (hex == null || !hex.startsWith("0x") || hex.length() != 66) {
            throw new IllegalArgumentException(label + " must be 0x + 64-hex");
        }
        // 유효한 hex 여부 한번 더 체크 (예외 발생 시 catch)
        try { Numeric.hexStringToByteArray(hex); }
        catch (Exception e) { throw new IllegalArgumentException(label + " invalid hex", e); }
    }

    private static LocalDateTime toUtc(long epochSeconds) {
        return LocalDateTime.ofInstant(Instant.ofEpochSecond(epochSeconds), ZoneOffset.UTC);
    }

    /** 프런트에서 lock을 완료한 뒤 기록만 하는 엔드포인트 로직 */
    @Transactional
    public BookingResponseVo recordOnchainReservation(RecordReservationRequest req) {
        // 1) 유효성
        requireHex66(req.getResId(), "resId");
        requireHex66(req.getTxHash(), "txHash");

        if (req.getAmount() == null || req.getAmount().compareTo(BigInteger.ZERO) < 0) {
            throw new IllegalArgumentException("amount must be >= 0");
        }
        if (req.getCheckInTimestamp() <= 0 || req.getCheckOutTimestamp() <= 0
                || req.getCheckInTimestamp() >= req.getCheckOutTimestamp()) {
            throw new IllegalArgumentException("check-in/out timestamps invalid");
        }

        // 2) Idempotency: 동일 txHash가 이미 있으면 그대로 반환 (중복 저장 방지)
        reservationRepository.findByTxHash(req.getTxHash()).ifPresent(existing ->
        { throw new IllegalStateException("txHash already recorded"); });

        // 3) 엔티티 작성
        Reservation entity = Reservation.builder()
                .reservationId(req.getResId())
                .txHash(req.getTxHash())
                .payment(req.getAmount())
                .checkinDate(toUtc(req.getCheckInTimestamp()))
                .checkoutDate(toUtc(req.getCheckOutTimestamp()))
                .settlement(false)
                .canceled(false)
                .build();

        Reservation saved = reservationRepository.save(entity);

        // 4) 응답 (필요 필드만)
        return new BookingResponseVo(saved.getReservationId(), saved.getTxHash());
    }
}
