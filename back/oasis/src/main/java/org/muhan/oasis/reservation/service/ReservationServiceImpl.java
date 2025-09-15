package org.muhan.oasis.reservation.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.muhan.oasis.common.base.BaseResponseStatus;
import org.muhan.oasis.common.exception.BaseException;
import org.muhan.oasis.key.repository.KeyOwnerRepository;
import org.muhan.oasis.key.repository.KeyRepository;
import org.muhan.oasis.reservation.dto.in.RegistReservationRequestDto;
import org.muhan.oasis.reservation.dto.out.ReservationDetailsResponseDto;
import org.muhan.oasis.reservation.dto.out.ReservationResponseDto;
import org.muhan.oasis.reservation.entity.ReservationEntity;
import org.muhan.oasis.reservation.repository.ReservationPeriodRow;
import org.muhan.oasis.reservation.repository.ReservationRepository;
import org.muhan.oasis.reservation.vo.out.ListOfReservationResponseVo;
import org.muhan.oasis.reservation.vo.out.ListOfReservedDayResponseVo;
import org.muhan.oasis.reservation.vo.out.ReservationDetailsResponseVo;
import org.muhan.oasis.reservation.vo.out.ReservedDayResponseVo;
import org.muhan.oasis.stay.dto.out.FacilityCategoryResponseDto;
import org.muhan.oasis.stay.dto.out.FacilityResponseDto;
import org.muhan.oasis.stay.entity.FacilityEntity;
import org.muhan.oasis.stay.entity.StayEntity;
import org.muhan.oasis.stay.entity.StayPhotoEntity;
import org.muhan.oasis.stay.entity.StayRatingSummaryEntity;
import org.muhan.oasis.stay.repository.FacilityRepository;
import org.muhan.oasis.stay.repository.StayRatingSummaryRepository;
import org.muhan.oasis.stay.repository.StayRepository;
import org.muhan.oasis.user.entity.UserEntity;
import org.muhan.oasis.user.repository.UserRepository;
import org.muhan.oasis.valueobject.Category;
import org.muhan.oasis.valueobject.Language;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

import static org.muhan.oasis.common.base.BaseResponseStatus.*;

@Service
@Log4j2
@RequiredArgsConstructor
public class ReservationServiceImpl implements ReservationService {
    private final UserRepository userRepository;
    private final ReservationRepository reservationRepository;
    private final StayRepository stayRepository;
    private final KeyOwnerRepository keyOwnerRepository;
    private final StayRatingSummaryRepository summaryRepository;

    @Override
    public String registReserVation(Long userId, RegistReservationRequestDto dto) {
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
    public ListOfReservedDayResponseVo getListOfReservedDay(Long userId, Long stayId) {
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
        List<ReservedDayResponseVo> list = rows.stream()
                .map(r -> ReservedDayResponseVo.of(r.checkinDate(), r.checkoutDate()))
                .toList();

        return ListOfReservedDayResponseVo.of(list);
    }

    @Override
    @Transactional(readOnly = true)
    public ReservationDetailsResponseDto getReservationDetails(Long userId,
                                                               Language language,
                                                               String reservationId) {

        if (userId == null || reservationId.isEmpty()) {
            throw new BaseException(INVALID_PARAMETER);
        }

        // 1) 예약 조회
        ReservationEntity r = reservationRepository.findById(reservationId) // PK 타입 Long/String에 맞게 제네릭/시그니처 조정
                .orElseThrow(() -> new BaseException(FAIL_REGIST_RESERVATION));

        // 2) 권한: 예약자이거나, 해당 숙소의 호스트여야 함
        UserEntity reserver = r.getUser();
        StayEntity stay = r.getStay();
        if (stay == null) throw new BaseException(NO_ACCESS_AUTHORITY);

        Long reserverId = reserver != null ? reserver.getUserId() : null;
        Long hostId = (stay.getUser() != null) ? stay.getUser().getUserId() : null; // ← 숙소의 호스트 연관명 확인 (user/host/owner)

        boolean isReserver = Objects.equals(userId, reserverId);
        boolean isHost = Objects.equals(userId, hostId);
        if (!isReserver && !isHost) {
            throw new BaseException(NO_ACCESS_AUTHORITY);
        }

        // 3) 언어별 텍스트 선택 (기본 KOR)
        boolean isEng = (language != null && language.name().equalsIgnoreCase("ENG"));

        String title       = isEng ? stay.getTitleEng()       : stay.getTitle();
        String description = isEng ? stay.getDescriptionEng() : stay.getDescription();
        String addrLine    = isEng ? stay.getAddressLineEng() : stay.getAddressLine();
        String addrDetail  = isEng ? stay.getAddrDetailEng(): stay.getAddrDetail();

        // 4) 사진(썸네일 포함) 수집
        List<String> photos = Optional.ofNullable(stay.getStayPhotoEntities())
                .orElse(List.of())
                .stream()
                .map(StayPhotoEntity::getPhotoUrl) // ← URL 필드/메서드명 확인
                .filter(Objects::nonNull)
                .toList();

        // 5) 편의시설 카테고리 묶기 (Category enum 기준)
        Map<Category, List<ReservationDetailsResponseDto.FacilityItemDto>> facilitiesByCategory =
                Optional.ofNullable(stay.getStayFacilities())
                        .orElse(List.of())
                        .stream()
                        .collect(Collectors.groupingBy(
                                sf -> sf.getFacility().getCategory(), // Category enum
                                Collectors.mapping(sf -> new ReservationDetailsResponseDto.FacilityItemDto(
                                        sf.getFacility().getId(),          // id
                                        sf.getFacility().getName(),        // name (KOR)
                                        (hasNameEng(sf.getFacility()) ? sf.getFacility().getNameEng() : null)
                                ), Collectors.toList())
                        ));

        // Map → List<FacilityCategoryDto>
        List<ReservationDetailsResponseDto.FacilityCategoryDto> facilityCategories =
                facilitiesByCategory.entrySet().stream()
                        .map(e -> new ReservationDetailsResponseDto.FacilityCategoryDto(e.getKey(), e.getValue()))
                        .toList();


        // 6) 리뷰 요약(평균/요약문) 조회 - 없으면 null
        StayRatingSummaryEntity summary = summaryRepository
                .findById(stay.getId())
                .orElse(null);

        ReservationDetailsResponseDto.ReviewSummaryDto reviewDto = (summary == null) ? null :
                new ReservationDetailsResponseDto.ReviewSummaryDto(
                        summary.getRatingCnt(),
                        summary.getAvgRating(),
                        summary.getHighRateSummary(),
                        summary.getHighRateSummaryEng(),
                        summary.getLowRateSummary(),
                        summary.getLowRateSummaryEng()
                );

        // 7) 참여자(스마트키 등) — 프로젝트에 맞는 소스에서 조회
        var owners = keyOwnerRepository.findAllByReservation_ReservationId(r.getReservationId());

        var members = owners.stream()
                .map(o -> {
                    var u = o.getUser();
                    return new ReservationDetailsResponseDto.ParticipantBriefDto(
                            u.getNickname(),
                            u.getProfileUrl()
                    );
                })
                .toList();

        ReservationDetailsResponseDto.ParticipantsDto participantsDto =
                new ReservationDetailsResponseDto.ParticipantsDto(members.size(), members);

        // 8) StayInfoDto 조립
        ReservationDetailsResponseDto.StayInfoDto stayDto = new ReservationDetailsResponseDto.StayInfoDto(
                stay.getId(),
                title,
                stay.getTitleEng(),
                description,
                stay.getDescriptionEng(),
                addrLine,
                stay.getAddressLineEng(),
                addrDetail,
                stay.getAddrDetailEng(),
                stay.getPostalCode(),
                photos,
                facilityCategories
        );

        // 9) 일정/호스트/최종 DTO 조립
        ReservationDetailsResponseDto.ScheduleInfoDto scheduleDto = new ReservationDetailsResponseDto.ScheduleInfoDto(r.getCheckinDate(), r.getCheckoutDate());

        ReservationDetailsResponseDto.HostInfoDto hostDto = (stay.getUser() == null) ? null :
                new ReservationDetailsResponseDto.HostInfoDto(
                        stay.getUser().getNickname(),
                        stay.getUser().getUserUuid(),
                        stay.getUser().getProfileUrl()
                );

        return new ReservationDetailsResponseDto(
                r.getReservationId(),
                r.getReservationDate(),
                r.isCancled(),
                r.isSettlemented(),
                r.isReviewed(),
                r.getPayment(),
                scheduleDto,
                stayDto,
                participantsDto,
                reviewDto,
                hostDto
        );
    }

    private boolean hasNameEng(FacilityEntity facility) {
        return facility != null
                && facility.getNameEng() != null
                && !facility.getNameEng().isBlank();
    }

}
