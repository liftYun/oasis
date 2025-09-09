package org.muhan.oasis.web3.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.*;
import org.web3j.crypto.Credentials;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.http.HttpService;
import org.web3j.tx.RawTransactionManager;

@Configuration
public class Web3Config {

    @Bean
    public Web3j web3j(@Value("${infura.url}") String rpcUrl) {
        return Web3j.build(new HttpService(rpcUrl));
    }

    @Bean
    public Credentials web3Credentials(@Value("${wallet.private.key}") String pk) {
        return Credentials.create(pk);
    }

    @Bean(name = "web3TxManager")
    public org.web3j.tx.TransactionManager web3TxManager(
            Web3j web3j,
            Credentials credentials
    ) {
        long CHAIN_ID = 80002L; // Polygon Amoy
        return new RawTransactionManager(web3j, credentials, CHAIN_ID);
    }
}

