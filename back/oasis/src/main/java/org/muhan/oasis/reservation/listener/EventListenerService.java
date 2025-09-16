package org.muhan.oasis.reservation.listener;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.muhan.oasis.reservation.entity.ReservationEntity;
import org.muhan.oasis.reservation.repository.ReservationRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.web3j.abi.EventEncoder;
import org.web3j.abi.TypeReference;
import org.web3j.abi.datatypes.Address;
import org.web3j.abi.datatypes.Event;
import org.web3j.abi.datatypes.generated.Bytes32;
import org.web3j.abi.datatypes.generated.Uint256;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.core.DefaultBlockParameterName;
import org.web3j.protocol.core.methods.request.EthFilter;

import java.util.Optional;

@Slf4j
@Component
@RequiredArgsConstructor
public class EventListenerService {

    private final Web3j web3j;
    private final ReservationRepository reservationRepository;

    @Value("${contract.address}")
    private String contractAddress;

    @PostConstruct
    public void startListening() {
        EthFilter filter = new EthFilter(
                DefaultBlockParameterName.LATEST,
                DefaultBlockParameterName.LATEST,
                contractAddress
        );

        Event refundedEvent = new Event(
                "Refunded",
                java.util.Arrays.asList(
                        new TypeReference<Bytes32>() {}, // resId
                        new TypeReference<Address>() {}, // guest
                        new TypeReference<Uint256>() {}  // total
                )
        );
        String eventSignature = EventEncoder.encode(refundedEvent);
        filter.addSingleTopic(eventSignature);

        log.info("✅ Listening for 'Refunded' events...");

        web3j.ethLogFlowable(filter).subscribe(eventLog -> {
            log.info("🔔 'Refunded' event received | Block={} TxHash={}",
                    eventLog.getBlockNumber(), eventLog.getTransactionHash());

            String reservationIdHex = eventLog.getTopics().get(1); // indexed resId
            handleRefundedEvent(reservationIdHex);

        }, error -> {
            log.error("🚨 Error while listening to events: {}", error.getMessage(), error);
        });
    }

    @Transactional
    public void handleRefundedEvent(String reservationId) {
        if (reservationRepository.existsById(reservationId)) {
            reservationRepository.markCanceled(reservationId);
            log.info("✅ DB updated: Reservation {} marked as CANCELED", reservationId);
        } else {
            log.warn("⚠️ No reservation found for resId={} → DB not updated", reservationId);
        }
    }
}