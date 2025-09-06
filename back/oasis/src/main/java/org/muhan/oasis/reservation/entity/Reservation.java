package org.muhan.oasis.reservation.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigInteger;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "reservations")
public class Reservation {

    // 단일 PK: resId (bytes32 -> "0x" + 64 hex)
    @Id
    @Column(name = "reservation_id", nullable = false, length = 66, updatable = false)
    private String reservationId;

    // 온체인 lock 트랜잭션 해시 (유니크 인덱스)
    @Column(name = "tx_hash", nullable = false, length = 66, unique = true, updatable = false)
    private String txHash;

    @Column(name = "amount", nullable = false)
    private BigInteger payment;

    @Column(name = "checkin_date", nullable = false)
    private LocalDateTime checkinDate;

    @Column(name = "checkout_date", nullable = false)
    private LocalDateTime checkoutDate;

    @Column(name = "settlement", nullable = false)
    @ColumnDefault("false")
    private boolean settlement; // 정산 여부

    @Column(name = "is_canceled")
    @ColumnDefault("false")
    private Boolean canceled;    // 취소 여부 (DB 컬럼명 유지)

    // 생성 시점 자동 기록 (LocalDate도 동작하지만 LocalDateTime 권장)
    @CreationTimestamp
    @Column(name = "reservation_date", updatable = false)
    private LocalDate reservationDate;
}
