package org.muhan.oasis.web3;

import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.web3j.abi.FunctionEncoder;
import org.web3j.abi.datatypes.Address;
import org.web3j.abi.datatypes.Function;
import org.web3j.abi.datatypes.StaticStruct;
import org.web3j.abi.datatypes.Type;
import org.web3j.abi.datatypes.generated.Bytes32;
import org.web3j.abi.datatypes.generated.Uint256;
import org.web3j.abi.datatypes.generated.Uint64;

import java.math.BigInteger;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

@Slf4j
public final class CallDataEncoder {
    private CallDataEncoder() {}

    private static final BigInteger USDC_DECIMALS = BigInteger.TEN.pow(6);

    @Data
    public static class EncodedPolicy {
        private long before1;
        private long before2;
        private long before3;
        private long before4;
        private int amtPct1;
        private int amtPct2;
        private int amtPct3;
        private int amtPct4;
        private int amtPct5;
        private int feePct1;
        private int feePct2;
        private int feePct3;
        private int feePct4;
        private int feePct5;
    }

    public static String encodeApprove(String spender, String amountUSDC, String feeUSDC) {
        log.info(">>> encodeApprove called. spender={}, amountUSDC={}, feeUSDC={}", spender, amountUSDC, feeUSDC);


        BigInteger amount = new BigInteger(amountUSDC);
        BigInteger fee = new BigInteger(feeUSDC);
        BigInteger total  = amount.add(fee);

        Address spenderAddr = new Address(spender);
        Uint256 value = new Uint256(total);

        log.debug("Parsed approve params: amount={}, fee={}, total={}", amount, fee, total);

        Function f = new Function(
                "approve",
                Arrays.asList(spenderAddr, value),
                Collections.emptyList()
        );
        String callData = FunctionEncoder.encode(f);
        log.info("Encoded approve calldata length={}, calldata={}", callData.length(), callData);

        return FunctionEncoder.encode(f);
    }


    public static String encodeLock(
            String resId32Hex,
            String host,
            String amountUSDC,
            String feeUSDC,
            long checkIn,
            long checkOut,
            StaticStruct policy
    ) {
        log.info(">>> encodeLock called. resId={}, host={}, amountUSDC={}, feeUSDC={}, checkIn={}, checkOut={}",
                resId32Hex, host, amountUSDC, feeUSDC, checkIn, checkOut);

        Bytes32 resId = new Bytes32(hexToFixed32(resId32Hex));
        Address hostAddr = new Address(host);


        Uint256 amount = new Uint256(new BigInteger(amountUSDC));
        Uint256 fee    = new Uint256(new BigInteger(feeUSDC));
        Uint64 in64    = new Uint64(BigInteger.valueOf(checkIn));
        Uint64 out64   = new Uint64(BigInteger.valueOf(checkOut));

        log.debug("Parsed lock params: amount={}, fee={}, in64={}, out64={}", amount.getValue(), fee.getValue(), in64.getValue(), out64.getValue());
        log.debug("Policy struct={}", policy);

        List<Type> lockInputs = Arrays.asList(
                resId,
                hostAddr,
                amount,
                fee,
                in64,
                out64,
                policy
        );

        Function f = new Function(
                "lock",
                lockInputs,
                Collections.emptyList()
        );

        String callData = FunctionEncoder.encode(f);
        log.info("Encoded lock calldata length={}, calldata={}", callData.length(), callData);
        return FunctionEncoder.encode(f);
    }

    private static byte[] hexToFixed32(String hex) {
        String clean = hex.startsWith("0x") ? hex.substring(2) : hex;
        if (clean.length() != 64) throw new IllegalArgumentException("resId must be 0x + 32-byte hex");
        byte[] out = new byte[32];
        for (int i = 0; i < 32; i++) {
            int idx = i * 2;
            out[i] = (byte) Integer.parseInt(clean.substring(idx, idx + 2), 16);
        }
        return out;
    }
}
