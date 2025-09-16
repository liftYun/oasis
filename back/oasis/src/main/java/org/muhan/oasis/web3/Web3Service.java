package org.muhan.oasis.web3;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.web3j.abi.FunctionEncoder;
import org.web3j.abi.datatypes.Function;
import org.web3j.abi.datatypes.generated.Bytes32;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.core.DefaultBlockParameterName;
import org.web3j.protocol.core.methods.request.Transaction;
import org.web3j.protocol.core.methods.response.EthCall;
import org.web3j.protocol.core.methods.response.EthEstimateGas;
import org.web3j.protocol.core.methods.response.EthSendTransaction;
import org.web3j.protocol.core.methods.response.TransactionReceipt;
import org.web3j.tx.TransactionManager;
import org.web3j.tx.response.PollingTransactionReceiptProcessor;
import org.web3j.tx.response.TransactionReceiptProcessor;
import org.web3j.utils.Numeric;

import java.math.BigInteger;
import java.util.Collections;
import java.util.List;

@Service
public class Web3Service {
    private final Web3j web3j;

    @Value("${contract.address}")
    private String contractAddress;
    private final TransactionManager txManager;

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
            throw new RuntimeException("eth_call reverted: " + dry.getRevertReason());
        }

        // 가스 추정
        BigInteger gasPrice = web3j.ethGasPrice().send().getGasPrice(); // 간단 버전
        EthEstimateGas est = web3j.ethEstimateGas(
                Transaction.createFunctionCallTransaction(from, null, gasPrice, null, contractAddress, data)
        ).send();
        if (est.hasError()) throw new RuntimeException("eth_estimateGas error: " + est.getError().getMessage());
        BigInteger gasLimit = est.getAmountUsed().multiply(BigInteger.valueOf(12)).divide(BigInteger.TEN);

        EthSendTransaction sent = txManager.sendTransaction(gasPrice, gasLimit, contractAddress, data, BigInteger.ZERO);
        if (sent.hasError()) throw new RuntimeException("send error: " + sent.getError().getMessage());

        TransactionReceiptProcessor proc = new PollingTransactionReceiptProcessor(web3j, 3_000, 40); // 3s 간격, 최대 40회(≈2분)
        TransactionReceipt receipt = proc.waitForTransactionReceipt(sent.getTransactionHash());

        if (!"0x1".equals(receipt.getStatus())) {
            throw new RuntimeException("tx failed: " + receipt.getTransactionHash());
        }
        return receipt.getTransactionHash();
    }
}
