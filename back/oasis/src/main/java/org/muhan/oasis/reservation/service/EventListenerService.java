package org.muhan.oasis.reservation.service;

import jakarta.annotation.PostConstruct;
import org.muhan.oasis.reservation.entity.Reservation;
import org.muhan.oasis.reservation.repository.ReservationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.web3j.abi.EventEncoder;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.core.DefaultBlockParameterName;
import org.web3j.protocol.core.methods.request.EthFilter;

import java.util.Optional;

@Service
public class EventListenerService {

    @Autowired
    private Web3j web3j;

    @Value("${contract.address}")
    private String contractAddress;

    @Autowired
    private ReservationRepository reservationRepository;


    @PostConstruct
    public void listenToEvents() {

        // 1. 필터 설정: 어떤 컨트랙트의 어떤 이벤트를 들을지 정의
        EthFilter filter = new EthFilter(
                DefaultBlockParameterName.LATEST, // 시작 블록 (LATEST: 현재부터)
                DefaultBlockParameterName.LATEST, // 종료 블록
                contractAddress
        );

        // 2. 이벤트 시그니처 추가: 'Refunded(bytes32,address,uint256)'
        // Solidity 이벤트의 keccak-256 해시값입니다.
        String eventSignature = EventEncoder.encode(
                new org.web3j.abi.datatypes.Event(
                        "Refunded",
                        java.util.Arrays.asList(
                                new org.web3j.abi.TypeReference<org.web3j.abi.datatypes.generated.Bytes32>() {},
                                new org.web3j.abi.TypeReference<org.web3j.abi.datatypes.Address>() {},
                                new org.web3j.abi.TypeReference<org.web3j.abi.datatypes.generated.Uint256>() {}
                        )
                )
        );
        filter.addSingleTopic(eventSignature);

        System.out.println("✅ 'Refunded' 이벤트 리스닝을 시작합니다...");

        // 3. 구독 시작
        web3j.ethLogFlowable(filter).subscribe(log -> {
            System.out.println("🔔 'Refunded' 이벤트 수신!");
            System.out.println("Block: " + log.getBlockNumber());
            System.out.println("TxHash: " + log.getTransactionHash());

            // 4. 이벤트 데이터 파싱
            // indexed된 파라미터는 topics에, 아닌 파라미터는 data에 들어옵니다.
            // Refunded(bytes32 resId, address guest, uint256 total)
            String reservationIdFromEvent = log.getTopics().get(1);

            // 4. 수신된 resId로 DB 업데이트 메서드를 호출합니다.
            updateBookingStatusToCanceled(reservationIdFromEvent);

        }, error -> {
            System.err.println("🚨 리스닝 중 에러 발생: " + error.getMessage());
        });
    }
    @Transactional
    public void updateBookingStatusToCanceled(String reservationId) {
        // reservationId로 DB에서 예약 정보를 찾습니다.
        Optional<Reservation> optionalReservation = reservationRepository.findById(reservationId);

        if (optionalReservation.isPresent()) {
            Reservation reservation = optionalReservation.get();
            reservation.cancel();
            reservationRepository.save(reservation); // 변경사항을 DB에 저장
            System.out.println("✅ DB 업데이트 완료: 예약 ID " + reservationId + "의 상태를 '취소'로 변경했습니다.");
        } else {
            System.err.println("⚠️ DB 업데이트 실패: 예약 ID " + reservationId + "를 찾을 수 없습니다.");
        }
    }


}
