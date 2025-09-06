package org.muhan.oasis.web3.service;

import org.muhan.oasis.reservation.dto.in.CreateReservationRequestDto;
import org.muhan.oasis.reservation.dto.out.BookingResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.web3j.abi.FunctionEncoder;
import org.web3j.abi.FunctionReturnDecoder;
import org.web3j.abi.TypeReference;
import org.web3j.abi.datatypes.*;
import org.web3j.abi.datatypes.generated.*;
import org.web3j.crypto.Credentials;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.core.DefaultBlockParameterName;
import org.web3j.protocol.core.methods.request.Transaction;
import org.web3j.protocol.core.methods.response.EthCall;
import org.web3j.protocol.core.methods.response.EthEstimateGas;
import org.web3j.protocol.core.methods.response.EthSendTransaction;
import org.web3j.protocol.core.methods.response.TransactionReceipt;
import org.web3j.protocol.http.HttpService;
import org.web3j.tx.RawTransactionManager;
import org.web3j.tx.response.PollingTransactionReceiptProcessor;
import org.web3j.tx.response.TransactionReceiptProcessor;
import org.web3j.utils.Numeric;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

@Service
public class Web3Service {
    private final Web3j web3j;
    private final String contractAddress;
    private static final long CHAIN_ID = 80002L; // Polygon Amoy

    private static final int USDC_DECIMALS = 6;


    public Web3Service(
            @Value("${infura.url}") String infuraUrl,
            @Value("${contract.address}") String contractAddress
    ) {
        this.web3j = Web3j.build(new HttpService(infuraUrl));
        this.contractAddress = contractAddress;
    }

    /**
     * 게스트 계정으로 컨트랙트 lock() 호출
     */
    public String createBooking(CreateReservationRequestDto req) throws Exception {
        // ⚠️ 게스트 프라이빗키는 외부에서 주입받아야 합니다.
        // 지금은 테스트용으로 하드코딩
        Credentials guestCred = Credentials.create("0d9b9f51805db5db8468aa0863ae424d25353056d262ea9dfe216d4422a74fd3");
        RawTransactionManager txManager = new RawTransactionManager(web3j, guestCred, CHAIN_ID);

        // 컨트랙트 lock() 함수 구성 (resId 제거됨)
        Function lockFn = createLockFunction(req);

        TransactionReceipt receipt = executeTransaction(txManager, contractAddress, lockFn);
        return receipt.getTransactionHash();
    }

    private Function createLockFunction(CreateReservationRequestDto req) {
        // PolicySnap 구조체 생성
        DynamicStruct policy = new DynamicStruct(
                new Uint32(req.getPolicyBefore1()),
                new Uint32(req.getPolicyBefore2()),
                new Uint16(req.getPolicyAmtPct1()),
                new Uint16(req.getPolicyAmtPct2()),
                new Uint16(req.getPolicyAmtPct3()),
                new Uint16(req.getPolicyFeePct1()),
                new Uint16(req.getPolicyFeePct2()),
                new Uint16(req.getPolicyFeePct3())
        );

        Bytes32 resIdBytes = new Bytes32(Numeric.hexStringToByteArray(req.getResId()));


        return new Function(
                "lock",
                Arrays.asList(
                        resIdBytes,
                        new Address(req.getHostAddress()),
                        new Uint256(req.getAmount()),
                        new Uint256(req.getFee()),
                        new Uint64(req.getCheckInTimestamp()),
                        new Uint64(req.getCheckOutTimestamp()),
                        policy
                ),
                Collections.emptyList()
        );
    }

    private TransactionReceipt executeTransaction(
            RawTransactionManager txManager, String target, Function function
    ) throws Exception {
        String encodedFunction = FunctionEncoder.encode(function);
        String from = txManager.getFromAddress();

        BigInteger gasPrice = web3j.ethGasPrice().send().getGasPrice();

        // Dry-run
        EthCall dryRun = web3j.ethCall(
                Transaction.createEthCallTransaction(from, target, encodedFunction),
                DefaultBlockParameterName.LATEST
        ).send();
        if (dryRun.isReverted()) {
            throw new RuntimeException("dry-run reverted: " + dryRun.getRevertReason());
        }

        // Gas estimate
        EthEstimateGas estimate = web3j.ethEstimateGas(
                Transaction.createFunctionCallTransaction(from, null, gasPrice, null, target, encodedFunction)
        ).send();
        if (estimate.hasError()) {
            throw new RuntimeException("eth_estimateGas error: " + estimate.getError().getMessage());
        }
        BigInteger gasLimit = estimate.getAmountUsed().multiply(BigInteger.valueOf(12)).divide(BigInteger.TEN);

        EthSendTransaction sentTx = txManager.sendTransaction(gasPrice, gasLimit, target, encodedFunction, BigInteger.ZERO);
        if (sentTx.hasError()) throw new RuntimeException(sentTx.getError().getMessage());

        TransactionReceiptProcessor proc = new PollingTransactionReceiptProcessor(web3j, 3000, 40);
        return proc.waitForTransactionReceipt(sentTx.getTransactionHash());
    }
    public static class PolicySnap extends StaticStruct {
        public BigInteger before1, before2, amtPct1, amtPct2, amtPct3, feePct1, feePct2, feePct3;
        public PolicySnap(Uint32 before1, Uint32 before2,
                          Uint16 amtPct1, Uint16 amtPct2, Uint16 amtPct3,
                          Uint16 feePct1, Uint16 feePct2, Uint16 feePct3) {
            super(before1, before2, amtPct1, amtPct2, amtPct3, feePct1, feePct2, feePct3);
            this.before1 = before1.getValue();
            this.before2 = before2.getValue();
            this.amtPct1 = amtPct1.getValue();
            this.amtPct2 = amtPct2.getValue();
            this.amtPct3 = amtPct3.getValue();
            this.feePct1 = feePct1.getValue();
            this.feePct2 = feePct2.getValue();
            this.feePct3 = feePct3.getValue();
        }
    }
    public static class Booking extends StaticStruct {
        public String guest, host;
        public BigInteger amount, fee, checkIn, checkOut, status;
        public PolicySnap policy;
        public Booking(Address guest, Address host, Uint256 amount, Uint256 fee,
                       Uint64 checkIn, Uint64 checkOut, Uint8 status, PolicySnap policy) {
            super(guest, host, amount, fee, checkIn, checkOut, status, policy);
            this.guest = guest.getValue();
            this.host = host.getValue();
            this.amount = amount.getValue();
            this.fee = fee.getValue();
            this.checkIn = checkIn.getValue();
            this.checkOut = checkOut.getValue();
            this.status = status.getValue();
            this.policy = policy;
        }
    }

    /** 메인: resId(hex32)로 온체인 예약 조회 */
    public BookingResponse getOnchainBooking(String resIdHex32, String caller) throws Exception {
        Bytes32 resId = toBytes32Strict(resIdHex32);
        String from = (caller == null || caller.isBlank())
                ? "0x0000000000000000000000000000000000000000" : caller;

        Function f = new Function("getBooking", List.of(resId), List.of(new TypeReference<Booking>() {}));
        String data = FunctionEncoder.encode(f);

        EthCall call = web3j.ethCall(
                Transaction.createEthCallTransaction(from, contractAddress, data),
                DefaultBlockParameterName.LATEST
        ).send();

        List<Type> out = FunctionReturnDecoder.decode(call.getValue(), f.getOutputParameters());
        if (out.isEmpty()) return null;

        Booking b = (Booking) out.get(0);
        BookingResponse resp = new BookingResponse();
        resp.setResIdHex("0x" + Numeric.toHexStringNoPrefix(resId.getValue()));
        resp.setGuest(b.guest);
        resp.setHost(b.host);
        resp.setAmount(formatUSDC(b.amount));
        resp.setFee(formatUSDC(b.fee));
        resp.setAmountRaw(b.amount);
        resp.setFeeRaw(b.fee);
        resp.setCheckIn(b.checkIn);
        resp.setCheckOut(b.checkOut);
        resp.setStatus(b.status);
//        resp.setStatusText(mapStatus(b.status));

        BookingResponse.Policy p = new BookingResponse.Policy();
        p.setBefore1(b.policy.before1); p.setBefore2(b.policy.before2);
        p.setAmtPct1(b.policy.amtPct1); p.setAmtPct2(b.policy.amtPct2); p.setAmtPct3(b.policy.amtPct3);
        p.setFeePct1(b.policy.feePct1); p.setFeePct2(b.policy.feePct2); p.setFeePct3(b.policy.feePct3);
        resp.setPolicy(p);
        return resp;
    }

    /* helpers */
    private static Bytes32 toBytes32Strict(String input) {
        if (input == null) throw new IllegalArgumentException("resId is required");
        String t = input.trim();
        if (!(t.startsWith("0x") && t.length() == 66)) {
            throw new IllegalArgumentException("resId must be 0x + 32-byte hex (66 chars)");
        }
        return new Bytes32(Numeric.hexStringToByteArray(t));
    }
    private static String mapStatus(BigInteger s) {
        switch (s.intValue()) {
            case 0: return "None";
            case 1: return "Locked";
            case 2: return "Released";
            case 3: return "Refunded";
            default: return "Unknown(" + s + ")";
        }
    }
    private static String formatUSDC(BigInteger raw) {
        return new BigDecimal(raw).movePointLeft(USDC_DECIMALS).toPlainString() + " USDC";
    }

}
