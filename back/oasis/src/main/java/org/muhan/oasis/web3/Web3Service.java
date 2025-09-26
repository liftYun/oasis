package org.muhan.oasis.web3;

import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.TransactionException;
import org.muhan.oasis.common.base.BaseResponseStatus;
import org.muhan.oasis.common.exception.BaseException;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.web3j.abi.FunctionEncoder;
import org.web3j.abi.TypeReference;
import org.web3j.abi.datatypes.Address;
import org.web3j.abi.datatypes.Bool;
import org.web3j.abi.datatypes.Function;
import org.web3j.abi.datatypes.generated.Bytes32;
import org.web3j.abi.datatypes.generated.Uint256;
import org.web3j.contracts.eip20.generated.ERC20;
import org.web3j.crypto.Credentials;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.core.DefaultBlockParameterName;
import org.web3j.protocol.core.methods.request.Transaction;
import org.web3j.protocol.core.methods.response.EthCall;
import org.web3j.protocol.core.methods.response.EthEstimateGas;
import org.web3j.protocol.core.methods.response.EthSendTransaction;
import org.web3j.protocol.core.methods.response.TransactionReceipt;
import org.web3j.tx.RawTransactionManager;
import org.web3j.tx.TransactionManager;
import org.web3j.tx.exceptions.ContractCallException;
import org.web3j.tx.gas.DefaultGasProvider;
import org.web3j.tx.response.PollingTransactionReceiptProcessor;
import org.web3j.tx.response.TransactionReceiptProcessor;
import org.web3j.utils.Numeric;

import java.io.IOException;
import java.math.BigInteger;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

@Service
@Slf4j
public class Web3Service {
    private final Web3j web3j;

    @Value("${contract.address}")
    private String contractAddress;

    @Qualifier("web3TxManager")
    private final TransactionManager txManager;

    @Value("${usdc.address}")
    private String usdcAddress;

    public Web3Service(Web3j web3j, TransactionManager txManager) {
        this.web3j = web3j;
        this.txManager = txManager;
    }

    public String releaseAndWait(String resIdHex) throws Exception {
        // 인코딩
        Function fn = new Function(
                "release",
                List.of(new Bytes32(Numeric.hexStringToByteArray(resIdHex))),
                Collections.emptyList()
        );
        String data = FunctionEncoder.encode(fn);
        String from = txManager.getFromAddress();

        EthCall dry = web3j.ethCall(
                Transaction.createEthCallTransaction(from, contractAddress, data),
                DefaultBlockParameterName.LATEST
        ).send();
        if (dry.isReverted()) {
            log.error("TopUp reverted, reason={}", dry.getRevertReason());
            throw new BaseException(BaseResponseStatus.WEB3_CALL_REVERTED);
        }

        // 가스 추정
        BigInteger gasPrice = web3j.ethGasPrice().send().getGasPrice(); // 간단 버전
        EthEstimateGas est = web3j.ethEstimateGas(
                Transaction.createFunctionCallTransaction(from, null, gasPrice, null, contractAddress, data)
        ).send();
        if (est.hasError()) {
            throw new BaseException(BaseResponseStatus.WEB3_GAS_ESTIMATE_FAILED);
        }
        BigInteger gasLimit = est.getAmountUsed().multiply(BigInteger.valueOf(12)).divide(BigInteger.TEN);

        EthSendTransaction sent = txManager.sendTransaction(gasPrice, gasLimit, contractAddress, data, BigInteger.ZERO);
        if (sent.hasError()) {
            throw new BaseException(BaseResponseStatus.WEB3_TX_FAILED);
        }
        TransactionReceiptProcessor proc = new PollingTransactionReceiptProcessor(web3j, 3_000, 40); // 3s 간격, 최대 40회(≈2분)
        TransactionReceipt receipt = proc.waitForTransactionReceipt(sent.getTransactionHash());

        if (!"0x1".equals(receipt.getStatus())) {
            throw new BaseException(BaseResponseStatus.WEB3_TX_FAILED);
        }
        return receipt.getTransactionHash();
    }


    public boolean canRelease(String resIdHex) throws IOException {
        Function fn = new Function(
                "canRelease",
                List.of(new Bytes32(Numeric.hexStringToByteArray(resIdHex))),
                List.of(new TypeReference<Bool>() {})
        );
        String data = FunctionEncoder.encode(fn);

        EthCall call = web3j.ethCall(
                Transaction.createEthCallTransaction(txManager.getFromAddress(), contractAddress, data),
                DefaultBlockParameterName.LATEST
        ).send();

        return Boolean.parseBoolean(call.getValue());
    }

    public String callTopUp(String to, BigInteger amount) throws Exception {
        ERC20 usdc = ERC20.load(usdcAddress, web3j, txManager, new DefaultGasProvider() {
            @Override
            public BigInteger getGasPrice(String contractFunc) {
                try {
                    return web3j.ethGasPrice().send().getGasPrice().multiply(BigInteger.valueOf(2));
                } catch (IOException e) {
                    throw new RuntimeException(e);
                }
            }

            @Override
            public BigInteger getGasLimit(String contractFunc) {
                return BigInteger.valueOf(200_000);
            }
        });

        int retries = 3; // 최대 재시도 횟수
        int delayMs = 3000; // 3초 대기

        for (int i = 0; i < retries; i++) {
            try {
                BigInteger balance = usdc.balanceOf(txManager.getFromAddress()).send();
                log.info("Admin balance: {}", balance);
                TransactionReceipt receipt = usdc.transfer(to, amount).send();
                String txHash = receipt.getTransactionHash();
                log.info("✅ TopUp TX Sent: to={}, amount={}, txHash={}", to, amount, txHash);
                return txHash;
            } catch (ContractCallException e) {
                log.error("Transfer reverted. from={}, to={}, amount={}, reason={}",
                        txManager.getFromAddress(), to, amount, e.getMessage());
                throw e;
            } catch (TransactionException e) {
                String msg = e.getMessage();
                if (msg != null && msg.contains("in-flight transaction limit")) {
                    log.warn("⚠️ In-flight tx limit reached. Retry {}/{} after {}ms", i + 1, retries, delayMs);
                    Thread.sleep(delayMs);
                } else {
                    throw e; // 다른 에러는 그냥 터뜨림
                }
            }
        }

        throw new RuntimeException("TopUp failed after retries");
    }



}
