package org.muhan.oasis.reservation.enums;

public enum ReservationStatus {
    PENDING,  // 결제 대기 (DB에 정보만 저장된 상태)
    PENDING_APPROVED,
    APPROVED, //결제 승인
    PENDING_LOCK,
    LOCKED,   // 결제 완료 (Approve, Lock 트랜잭션 모두 성공)
    CANCELED,  // 결제 실패 또는 취소
    SETTLEMENTED
}
