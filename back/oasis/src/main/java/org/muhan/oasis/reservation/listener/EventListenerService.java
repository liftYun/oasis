package org.muhan.oasis.reservation.listener;

import io.reactivex.disposables.Disposable;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.muhan.oasis.config.Web3jConfig;
import org.muhan.oasis.reservation.entity.ReservationEntity;
import org.muhan.oasis.reservation.repository.ReservationRepository;
import org.muhan.oasis.reservation.service.ReservationUpdateService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.web3j.abi.EventEncoder;
import org.web3j.abi.TypeReference;
import org.web3j.abi.datatypes.Address;
import org.web3j.abi.datatypes.Event;
import org.web3j.abi.datatypes.generated.Bytes32;
import org.web3j.abi.datatypes.generated.Uint256;
import org.web3j.abi.datatypes.generated.Uint8;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.core.DefaultBlockParameterName;
import org.web3j.protocol.core.methods.request.EthFilter;

import java.util.Arrays;
import java.util.Optional;

@Slf4j
@Component
@RequiredArgsConstructor
public class EventListenerService {

    private final Web3j web3j;
    private final Web3jConfig web3jConfig;
    private final ReservationUpdateService reservationUpdateService;

    @Value("${contract.address}")
    private String contractAddress;

    private Disposable subscription;

    @PostConstruct
    public void startListening() {
        Web3j web3j = web3jConfig.getWeb3j();
        EthFilter filter = new EthFilter(
                DefaultBlockParameterName.LATEST,
                DefaultBlockParameterName.LATEST,
                contractAddress
        );

        Event canceledWithPolicyEvent = new Event(
                "CanceledWithPolicy",
                Arrays.asList(
                        new TypeReference<Bytes32>(true) {}, // indexed resId
                        new TypeReference<Uint8>() {},       // tier
                        new TypeReference<Uint256>() {},     // refundToGuestAmt
                        new TypeReference<Uint256>() {},     // payToHostAmt
                        new TypeReference<Uint256>() {},     // refundToGuestFee
                        new TypeReference<Uint256>() {}      // payToTreasuryFee
                )
        );

        String canceledWithPolicySig = EventEncoder.encode(canceledWithPolicyEvent);
        EthFilter canceledFilter = new EthFilter(
                DefaultBlockParameterName.LATEST,
                DefaultBlockParameterName.LATEST,
                contractAddress
        ).addSingleTopic(canceledWithPolicySig);

        // 기존 구독 해제
        if (subscription != null && !subscription.isDisposed()) {
            subscription.dispose();
            log.info("🛑 Previous subscription disposed");
        }

        // 새 구독 생성
        subscription = web3j.ethLogFlowable(canceledFilter).subscribe(eventLog -> {
            log.info("🔔 'CanceledWithPolicy' event received | Block={} TxHash={}",
                    eventLog.getBlockNumber(), eventLog.getTransactionHash());

            String reservationIdHex = eventLog.getTopics().get(1); // indexed resId
            reservationUpdateService.markCanceled(reservationIdHex);

        }, error -> {
            log.error("🚨 Error in event listener: {}", error.getMessage(), error);

            // 재연결 & 리스닝 재시작
            try {
                Thread.sleep(5000);
                web3jConfig.reconnect();
                startListening(); // dispose → 새 구독
                log.info("🔄 EventListenerService restarted after reconnect");
            } catch (Exception ex) {
                log.error("❌ Failed to restart EventListenerService: {}", ex.getMessage(), ex);
            }
        });
    }
}