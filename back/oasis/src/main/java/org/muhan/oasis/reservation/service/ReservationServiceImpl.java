package org.muhan.oasis.reservation.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.muhan.oasis.common.base.BaseResponse;
import org.muhan.oasis.common.base.BaseResponseStatus;
import org.muhan.oasis.common.exception.BaseException;
import org.muhan.oasis.reservation.dto.in.RegistReservationRequestDto;
import org.muhan.oasis.reservation.dto.out.ReservationResponseDto;
import org.muhan.oasis.reservation.entity.ReservationEntity;
import org.muhan.oasis.reservation.repository.ReservationPeriodRow;
import org.muhan.oasis.reservation.repository.ReservationRepository;
import org.muhan.oasis.reservation.vo.out.ListOfReservationResponseVo;
import org.muhan.oasis.reservation.vo.out.ListOfReservedDayVo;
import org.muhan.oasis.reservation.vo.out.ReservedDayVo;
import org.muhan.oasis.stay.entity.StayEntity;
import org.muhan.oasis.stay.repository.StayRepository;
import org.muhan.oasis.user.entity.UserEntity;
import org.muhan.oasis.user.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;

import static org.muhan.oasis.common.base.BaseResponseStatus.*;

@Service
@Log4j2
@RequiredArgsConstructor
public class ReservationServiceImpl implements ReservationService {
    private final UserRepository userRepository;
    private final ReservationRepository reservationRepository;
    private final StayRepository stayRepository;

    @Override
    public String registReserVation(Long userId, RegistReservationRequestDto dto) {
        System.out.println("userID : " + userId);
        System.out.println("stayId : " + dto.getStayId());
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new BaseException(BaseResponseStatus.NO_EXIST_USER));

        StayEntity stay = stayRepository.findById(dto.getStayId())
                .orElseThrow(() -> new BaseException(BaseResponseStatus.NO_STAY));;

        ReservationEntity reservationEntity = RegistReservationRequestDto.to(user, stay, dto);

        return reservationRepository.save(reservationEntity).getReservationId();
    }

    @Override
    public ListOfReservationResponseVo getListOfReservation(Long userId) {
        List<ReservationEntity> entities = reservationRepository
                .findAllByUser_UserIdOrderByReservationDateDesc(userId);

        /**
         * 응답 전용 구조를 정의할 수 있음 (API contract)
         * 불필요한 내부 필드 차단 가능
         * 추가 계산/가공해서 클라이언트 친화적으로 전달 가능
         * 엔티티 ↔ API 응답 분리 → DB 모델이 바뀌어도 API 계약은 그대로 유지
         */
        List<ReservationResponseDto> dtos = entities.stream()
                .map(ReservationResponseDto::fromEntity)
                .toList();

        return ListOfReservationResponseVo.of(dtos);
    }

    @Override
    @Transactional(readOnly = true)
    public ListOfReservedDayVo getListOfReservedDay(Long userId, Long stayId) {
        if (userId == null || stayId == null || stayId <= 0) {
            throw new BaseException(INVALID_PARAMETER);
        }

        // 1) 숙소 존재 확인
        StayEntity stay = stayRepository.findById(stayId)
                .orElseThrow(() -> new BaseException(NO_STAY));

        // 2) 호스트 일치 검증 (stay.user.userId == 요청자 userId)
        Long hostUserId = stay.getUser() != null ? stay.getUser().getUserId() : null;
        if (hostUserId == null || !hostUserId.equals(userId)) {
            // 호스트가 아님 → 접근 권한 없음
            throw new BaseException(NO_ACCESS_AUTHORITY);
        }
        // 오늘(Asia/Seoul) 00:00 기준 이후만 조회
        ZoneId KST = ZoneId.of("Asia/Seoul");
        LocalDate today = LocalDate.now(KST);
        LocalDateTime todayStart = today.atStartOfDay(); // 00:00

        // 3) 예약 목록 조회 (취소건 제외)
        List<ReservationPeriodRow> rows =
                reservationRepository.findFuturePeriodsByStayId(stayId, todayStart);

        // 4) VO 매핑 (LocalDate로 변환하여 달력 마킹에 최적화)
        List<ReservedDayVo> list = rows.stream()
                .map(r -> ReservedDayVo.of(r.checkinDate(), r.checkoutDate()))
                .toList();

        return ListOfReservedDayVo.of(list);
    }
}
