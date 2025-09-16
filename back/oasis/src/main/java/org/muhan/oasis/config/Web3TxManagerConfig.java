package org.muhan.oasis.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.web3j.crypto.Credentials;
import org.web3j.protocol.Web3j;
import org.web3j.tx.RawTransactionManager;
import org.web3j.tx.TransactionManager;

@Configuration
public class Web3TxManagerConfig {

    @Value("${wallet.private.key}")
    private String privateKey;

    @Value("${chain.id}")
    private long chainId;

    private final Web3j web3j;

    public Web3TxManagerConfig(Web3j web3j) {
        this.web3j = web3j;
    }

    @Bean(name = "web3TxManager")
    public TransactionManager transactionManager() {
        Credentials cred = Credentials.create(privateKey);
        return new RawTransactionManager(web3j, cred, chainId);
    }
}