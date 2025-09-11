package org.muhan.oasis.booking.util;

import org.muhan.oasis.booking.dto.PolicySnap;
import org.web3j.abi.FunctionEncoder;
import org.web3j.abi.TypeReference;
import org.web3j.abi.datatypes.*;
import org.web3j.abi.datatypes.generated.*;
import org.web3j.crypto.Hash;

import java.math.BigInteger;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;

public final class AbiEncoder {

    private AbiEncoder() {}

    public static String encodeApprove(String spender, BigInteger amount) {
        Function fn = new Function(
                "approve",
                Arrays.asList(new Address(spender), new Uint256(amount)),
                Arrays.asList(new TypeReference<Bool>() {})
        );
        return FunctionEncoder.encode(fn);
    }

    public static String encodeLock(
            String resIdHex, String host, BigInteger amount, BigInteger fee,
            long checkIn, long checkOut, PolicySnap p
    ) {
        Bytes32 resId = toBytes32(resIdHex);
        StaticStruct policy = new StaticStruct(
                new Uint32(BigInteger.valueOf(p.getBefore1())),
                new Uint32(BigInteger.valueOf(p.getBefore2())),
                new Uint16(BigInteger.valueOf(p.getAmtPct1())),
                new Uint16(BigInteger.valueOf(p.getAmtPct2())),
                new Uint16(BigInteger.valueOf(p.getAmtPct3())),
                new Uint16(BigInteger.valueOf(p.getFeePct1())),
                new Uint16(BigInteger.valueOf(p.getFeePct2())),
                new Uint16(BigInteger.valueOf(p.getFeePct3()))
        );

        Function fn = new Function(
                "lock",
                Arrays.asList(
                        resId,
                        new Address(host),
                        new Uint256(amount),
                        new Uint256(fee),
                        new Uint64(BigInteger.valueOf(checkIn)),
                        new Uint64(BigInteger.valueOf(checkOut)),
                        policy
                ),
                Arrays.asList()
        );
        return FunctionEncoder.encode(fn);
    }

    public static Bytes32 toBytes32(String hexOrSeed) {
        if (hexOrSeed != null && hexOrSeed.startsWith("0x") && hexOrSeed.length() == 66) {
            byte[] b = org.web3j.utils.Numeric.hexStringToByteArray(hexOrSeed);
            return new Bytes32(b);
        }
        // seed → keccak256
        String seed = (hexOrSeed == null || hexOrSeed.isEmpty()) ? String.valueOf(System.nanoTime()) : hexOrSeed;
        byte[] hash = Hash.sha3(seed.getBytes(StandardCharsets.UTF_8));
        return new Bytes32(hash);
    }
}
