package org.muhan.oasis.stay.service;

import jakarta.validation.constraints.Size;
import lombok.RequiredArgsConstructor;
import org.muhan.oasis.common.base.BaseResponse;
import org.muhan.oasis.common.base.BaseResponseStatus;
import org.muhan.oasis.common.exception.BaseException;
import org.muhan.oasis.openAI.dto.in.AddrRequestDto;
import org.muhan.oasis.openAI.dto.in.StayRequestDto;
import org.muhan.oasis.openAI.dto.out.StayTranslationResultDto;
import org.muhan.oasis.reservation.repository.ReservationRepository;
import org.muhan.oasis.s3.service.S3StorageService;
import org.muhan.oasis.stay.dto.in.*;
import org.muhan.oasis.stay.dto.out.*;
import org.muhan.oasis.stay.entity.*;
import org.muhan.oasis.stay.repository.*;
import org.muhan.oasis.user.entity.UserEntity;
import org.muhan.oasis.user.repository.UserRepository;
import org.muhan.oasis.valueobject.Language;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionSynchronization;
import org.springframework.transaction.support.TransactionSynchronizationManager;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

import static org.muhan.oasis.common.base.BaseResponseStatus.*;

@Service
@RequiredArgsConstructor
public class StayServiceImpl implements StayService{

    private final UserRepository userRepository;
    private final SubRegionRepository subRegionRepository;
    private final SubRegionEngRepository subRegionEngRepository;
    private final FacilityRepository facilityRepository;
    private final DeviceRepository deviceRepository;
    private final StayRatingSummaryRepository stayRatingSummaryRepository;
    private final StayBlockRepository stayBlockRepository;
    private final StayFacilityRepository stayFacilityRepository;
    private final StayPhotoRepository stayPhotoRepository;
    private final StayRepository stayRepository;
    private final S3StorageService s3StorageService;
    private final ReservationRepository reservationRepository;

    @Override
    @Transactional
    public StayResponseDto registStay(CreateStayRequestDto stayRequest, String userUuid) {

        UserEntity user = userRepository.findByUserUuid(userUuid).orElseThrow(() -> new BaseException(BaseResponseStatus.NO_EXIST_USER));

        // subRegion 찾기
        Long subRegionId = stayRequest.getSubRegionId();

        SubRegionEntity subRegion = subRegionRepository.findById(subRegionId)
                .orElseThrow(() -> new BaseException(BaseResponseStatus.NO_EXIST_SUBREGION));
        SubRegionEngEntity subRegionEng = subRegionEngRepository.findById(subRegionId)
                .orElseThrow(() -> new BaseException(BaseResponseStatus.NO_EXIST_SUBREGION));

        // 취소정책 찾기 - 이후 수정
        CancellationPolicyEntity cancellationPolicy = user.getActiveCancelPolicy();

        String thumbnailUrl = null;
        if(stayRequest.getThumbnail() != null){
            thumbnailUrl = s3StorageService.toPublicUrl(stayRequest.getThumbnail());
        }
        // 숙소 이름, 설명, 가격, 주소, 우편번호, 수용인원, 썸네일, 지역으로 생성
        StayEntity stay =
                stayRepository.save(
                        StayEntity.builder()
                            .title(stayRequest.getTitle())
                            .titleEng(stayRequest.getTitleEng())
                            .description(stayRequest.getDescription())
                            .descriptionEng(stayRequest.getDescriptionEng())
                            .price(stayRequest.getPrice())
                            .addressLine(stayRequest.getAddress())
                            .addressLineEng(stayRequest.getAddressEng())
                            .postalCode(stayRequest.getPostalCode())
                            .maxGuests(stayRequest.getMaxGuest())
                            .thumbnail(thumbnailUrl)
                            .subRegionEntity(subRegion)
                            .subRegionEngEntity(subRegionEng)
                            .user(user)
                            .cancellationPolicyEntity(cancellationPolicy)
                            .addrDetail(stayRequest.getAddressDetail())
                            .addrDetailEng(stayRequest.getAddressDetailEng())
                                .language(user.getLanguage())
                            .build());

        // 디바이스 생성
        DeviceEntity device = deviceRepository.save(
                DeviceEntity.builder()
                .stayName(stayRequest.getTitle())
                .stayNameEng(stayRequest.getTitleEng())
                .stay(stay)
                .build());


        // 숙소별 별점 요약 생성
        StayRatingSummaryEntity ratingSummary = stayRatingSummaryRepository.save(
                StayRatingSummaryEntity.builder()
                        .stay(stay)
                        .build());

        // 예약 불가능 날짜 생성
        List<StayBlockEntity> stayBlocks = stayBlockRepository.saveAll(
                Optional.ofNullable(stayRequest.getBlockRangeList()).orElseGet(List::of).stream()
                        .map(dto -> StayBlockEntity.from(dto, stay))
                        .toList());

        // 숙소 편의시설 등록
        List<Long> ids = Optional.ofNullable(stayRequest.getFacilities())
                .orElseGet(List::of);

        if (!ids.isEmpty()) {

            List<Long> uniqueIds = ids.stream().distinct().toList();

            Map<Long, FacilityEntity> facilityMap = facilityRepository.findAllById(uniqueIds)
                    .stream()
                    .collect(Collectors.toMap(FacilityEntity::getId, Function.identity()));


            List<Long> missing = uniqueIds.stream()
                    .filter(id -> !facilityMap.containsKey(id))
                    .toList();

            if (!missing.isEmpty()) {
                throw new BaseException(BaseResponseStatus.NO_EXIST_FACILITY);
            }

            List<StayFacilityEntity> stayFacilities = uniqueIds.stream()
                    .map(fid -> StayFacilityEntity.builder()
                            .stay(stay)
                            .facility(facilityMap.get(fid))
                            .build())
                    .toList();

            stayFacilityRepository.saveAll(stayFacilities);
            stay.addFacilities(stayFacilities);
        }

        // 사진
        List<StayPhotoEntity> photos = new ArrayList<>();
        for (ImageRequestDto imageRequestDto : stayRequest.getImageRequestList()) {
            String requiredPrefix = "stay-image/" + user.getUserUuid();
            if (imageRequestDto.key() == null || !imageRequestDto.key().startsWith(requiredPrefix)) {
                throw new BaseException(NO_IMG_DATA);
            }

            // 2) 실제로 업로드 완료되었는지 S3 HEAD로 확인
            if (!s3StorageService.exists(imageRequestDto.key())) {
                throw new BaseException(NO_IMG_DATA);
            }

            // 3) 퍼블릭 URL(CloudFront or S3) 생성
            String publicUrl = s3StorageService.toPublicUrl(imageRequestDto.key());
            StayPhotoEntity photoEntity = StayPhotoEntity.from(imageRequestDto, stay, publicUrl);
            photos.add(photoEntity);
        }
        List<StayPhotoEntity> photoList = stayPhotoRepository.saveAll(photos);

        stay.attachDevice(device);
        stay.attachRatingSummary(ratingSummary);

        stay.addPhotos(photoList);

        return StayResponseDto.builder()
                .stayId(stay.getId()).build();
    }

    @Override
    @Transactional(readOnly = true)
    public StayReadResponseDto getStayById(Long stayId, Language language) {
        StayEntity stay = stayRepository.findDetailForRead(stayId).orElseThrow(() -> new BaseException(BaseResponseStatus.NO_STAY));
        List<StayFacilityEntity> facilities = stayFacilityRepository.findWithFacilityByStayId(stayId);
        LocalDate cutoff = LocalDate.now(ZoneId.of("Asia/Seoul"));
        List<StayBlockEntity> blcokList = stayBlockRepository.findAllByStayIdAndEndDateAfterOrderByStartDateAsc(stayId, cutoff);
        List<ReservedResponseDto> reservedList = reservationRepository.findAllReservedByStayId(stayId);
        return StayReadResponseDto.from(stay, facilities, language, blcokList, reservedList);
    }

    @Override
    @Transactional
    public StayReadResponseDto updateStay(Long stayId, UpdateStayRequestDto stayRequest, String userUuid) {
        StayEntity stay = stayRepository.findById(stayId).orElseThrow(() -> new BaseException(NO_STAY));

        if(!stay.getUser().getUserUuid().equals(userUuid))
            throw new BaseException(NO_ACCESS_AUTHORITY);

        //title
        if(stayRequest.getTitle() != null && stayRequest.getTitleEng() != null){
            stay.setTitle(stayRequest.getTitle());
            stay.setTitleEng(stayRequest.getTitleEng());
        }

        //description
        if(stayRequest.getDescription() != null && stayRequest.getDescriptionEng() != null){
            stay.setDescription(stayRequest.getDescription());
            stay.setDescriptionEng(stayRequest.getDescriptionEng());
        }

        //price
        if(stayRequest.getPrice() != null){
            stay.setPrice(stayRequest.getPrice());
        }

        //address + postalcode
        if(stayRequest.getAddress() != null && stayRequest.getAddressEng() != null
            && stayRequest.getPostalCode() != null) {
            stay.setAddressLine(stayRequest.getAddress());
            stay.setAddressLineEng(stayRequest.getAddressEng());
            stay.setPostalCode(stayRequest.getPostalCode());
        }

        //addressDetail
        if(stayRequest.getAddressDetail() != null && stayRequest.getAddressDetailEng() != null){
            stay.setAddrDetail(stayRequest.getAddressDetail());
            stay.setAddrDetailEng(stayRequest.getAddressDetailEng());
        }

        //maxGuest
        if(stayRequest.getMaxGuest() != null){
            stay.setMaxGuests(stayRequest.getMaxGuest());
        }

        //imageRequestList
        replaceStayPhotos(stay, stayRequest.getImageRequestList());

        //facilities
        updateFacilities(stay, stayRequest.getFacilities());

        //blockRangeList
        replaceStayBlocks(stay, stayRequest.getBlockRangeList());

        //subRegionId
        if(stayRequest.getSubRegionId() != null){
            SubRegionEntity subRegion = subRegionRepository.findById(stayRequest.getSubRegionId()).orElseThrow(() -> new BaseException(NO_EXIST_SUBREGION));
            SubRegionEngEntity subRegionEng = subRegionEngRepository.findById(stayRequest.getSubRegionId()).orElseThrow(() -> new BaseException(NO_EXIST_SUBREGION));
            stay.setSubRegionEntity(subRegion);
            stay.setSubRegionEngEntity(subRegionEng);
        }

        return StayReadResponseDto.builder()
                .stayId(stay.getId()).build();
    }

    @Transactional
    public void replaceStayBlocks(StayEntity stay, List<BlockRangeDto> requested) {
        List<BlockRangeDto> req = Optional.ofNullable(requested).orElseGet(List::of);

        // 1) 정규화 + 병합 ([start, end) 반열린 구간으로 통일)
        List<BlockRangeDto> merged = normalizeAndMerge(req);

        // (선택) 2) 기존 예약과 충돌 검사

        for (BlockRangeDto r : merged) {
            boolean conflict = reservationRepository.existsConfirmedOverlap(
                    stay.getId(), r.start().atStartOfDay(), r.end().atStartOfDay());
            if (conflict) {
                throw new BaseException(BaseResponseStatus.BLOCK_OVERLAP_RESERVATION);
            }
        }


        // 3) DB 전량 교체
        stayBlockRepository.deleteByStayId(stay.getId());
        stayBlockRepository.flush();

        List<StayBlockEntity> blocks = merged.stream()
                .map(r -> StayBlockEntity.builder()
                        .stay(stay)
                        .startDate(r.start())
                        .endDate(r.end())
                        .build())
                .toList();

        stayBlockRepository.saveAll(blocks);
    }

    private List<BlockRangeDto> normalizeAndMerge(List<BlockRangeDto> req) {
        // UI가 날짜(포함 끝)라면: end + 1일, 00:00 으로 변환 → [start, end)
        List<BlockRangeDto> ranges = req.stream()
                .map(d -> {
                    LocalDateTime s = d.start().atStartOfDay();
                    LocalDateTime e = d.end().plusDays(1).atStartOfDay();
                    if (!s.isBefore(e)) throw new BaseException(BaseResponseStatus.INVALID_BLOCK_RANGE);
                    return new BlockRangeDto(s.toLocalDate(), e.toLocalDate());
                })
                .sorted(Comparator.comparing(BlockRangeDto::start))
                .toList();

        // 겹치거나 맞닿는 구간 병합 (curr.start <= last.end 이면 merge)
        List<BlockRangeDto> merged = new ArrayList<>();
        for (BlockRangeDto cur : ranges) {
            if (merged.isEmpty()) { merged.add(cur); continue; }
            BlockRangeDto last = merged.get(merged.size()-1);
            if (!cur.start().isAfter(last.end())) { // overlap or contiguous
                LocalDateTime newEnd = (cur.end().isAfter(last.end()) ? cur.end() : last.end()).atStartOfDay();
                merged.set(merged.size()-1, new BlockRangeDto(last.start(), newEnd.toLocalDate()));
            } else {
                merged.add(cur);
            }
        }
        return merged;
    }

    @Transactional
    public void updateFacilities(StayEntity stay, List<Long> requestedFacilityIds) {
        List<Long> req = Optional.ofNullable(requestedFacilityIds).orElseGet(List::of)
                .stream().distinct().toList();

        // 현재 연결
        List<StayFacilityEntity> current = stayFacilityRepository.findWithFacilityByStayId(stay.getId());
        Set<Long> currIds = current.stream().map(sf -> sf.getFacility().getId()).collect(Collectors.toSet());

        // diff
        Set<Long> toAdd = new HashSet<>(req);   toAdd.removeAll(currIds);
        Set<Long> toDel = new HashSet<>(currIds); toDel.removeAll(req);

        // 삭제
        if (!toDel.isEmpty()) {
            stayFacilityRepository.deleteByStayIdAndFacilityIds(stay.getId(), toDel);
            // 메모리 동기화
            stay.getStayFacilities().removeIf(sf -> toDel.contains(sf.getFacility().getId()));
        }

        // 추가 (존재 검증 포함)
        if (!toAdd.isEmpty()) {
            Map<Long, FacilityEntity> map = facilityRepository.findAllById(toAdd).stream()
                    .collect(Collectors.toMap(FacilityEntity::getId, Function.identity()));
            if (map.size() != toAdd.size()) {
                throw new BaseException(BaseResponseStatus.NO_EXIST_FACILITY);
            }
            List<StayFacilityEntity> adds = toAdd.stream()
                    .map(fid -> StayFacilityEntity.builder().stay(stay).facility(map.get(fid)).build())
                    .toList();

            List<StayFacilityEntity> saved = stayFacilityRepository.saveAll(adds);
            saved.forEach(stay::addFacility); // 편의 메서드로 양방향 동기화
        }
    }

    @Transactional
    public void replaceStayPhotos(StayEntity stay, List<ImageRequestDto> requested) {
        List<ImageRequestDto> req = Optional.ofNullable(requested).orElseGet(List::of);

        // 0) 검증: key/정렬 중복 방지
        var dupKeys = req.stream()
                .collect(Collectors.groupingBy(ImageRequestDto::key, Collectors.counting()))
                .entrySet().stream().filter(e -> e.getValue() > 1).map(Map.Entry::getKey).toList();
        if (!dupKeys.isEmpty()) throw new BaseException(BaseResponseStatus.DUP_PHOTO_KEYS);

        var dupOrders = req.stream()
                .collect(Collectors.groupingBy(ImageRequestDto::sortOrder, Collectors.counting()))
                .entrySet().stream().filter(e -> e.getValue() > 1).map(Map.Entry::getKey).toList();
        if (!dupOrders.isEmpty()) throw new BaseException(BaseResponseStatus.DUP_PHOTO_SORT_ORDER);

        // 1) 기존 키 보관 (DB 커밋 후 S3 삭제용)
        List<StayPhotoEntity> existing = stayPhotoRepository.findAllByStay(stay);
        Set<String> oldKeys = existing.stream().map(StayPhotoEntity::getPhotoKey).collect(Collectors.toSet());

        // 2) 새 엔티티 목록 구성 (요청 정렬 그대로 사용)
        List<StayPhotoEntity> newPhotos = req.stream()
                .sorted(Comparator.comparingInt(ImageRequestDto::sortOrder))
                .map(dto -> StayPhotoEntity.builder()
                        .stay(stay)                                        // FK 세팅
                        .photoKey(dto.key())
                        .photoUrl(s3StorageService.toPublicUrl(dto.key()))
                        .sortOrder(dto.sortOrder())
                        .build())
                .toList();

        Set<String> newKeys = newPhotos.stream().map(StayPhotoEntity::getPhotoKey).collect(Collectors.toSet());
        List<String> keysToDelete = oldKeys.stream().filter(k -> !newKeys.contains(k)).toList();

        // 3) DB: 모두 삭제 → 모두 삽입 (유니크 충돌/오더 업데이트 이슈 無)
        stayPhotoRepository.deleteAllInBatch(existing); // 또는 custom: deleteByStayId(stay.getId())
        stayPhotoRepository.flush();

        List<StayPhotoEntity> persisted = stayPhotoRepository.saveAll(newPhotos);

        // 4) 메모리 컬렉션 동기화 (세터 금지, 편의 메서드/컬렉션 조작)
        stay.getStayPhotoEntities().clear();
        persisted.forEach(stay::addPhoto);

        // 5) S3 삭제는 커밋 이후
        if (!keysToDelete.isEmpty()) {
            TransactionSynchronizationManager.registerSynchronization(new TransactionSynchronization() {
                @Override public void afterCommit() {
                    keysToDelete.forEach(s3StorageService::delete);
                }
            });
        }
    }

    @Override
    @Transactional
    public void recalculateRating(Long stayId, BigDecimal rating) {
        StayRatingSummaryEntity ratingSummary = stayRatingSummaryRepository.findById(stayId)
                .orElseThrow(() -> new BaseException(BaseResponseStatus.NO_STAY_SUMMARY));
        ratingSummary.recalculate(rating);
    }

    @Override
    @Transactional
    public void deleteStay(Long stayId, String userUuid) {
        StayEntity stay = stayRepository.findById(stayId)
                .orElseThrow(() -> new BaseException(NO_STAY));

        if(!stay.getUser().getUserUuid().equals(userUuid))
            throw new BaseException(NO_ACCESS_AUTHORITY);

        stayRepository.delete(stay);
    }

    @Override
    public List<StayCardDto> searchStay(Long lastStayId, StayQueryRequestDto stayQuery, String userUuid) {
        if (stayQuery.getCheckIn() != null && stayQuery.getCheckout() != null && stayQuery.getCheckIn().isBefore(stayQuery.getCheckout())) {
            throw new BaseException(BaseResponseStatus.INVALID_PARAMETER);
        }

        UserEntity user = userRepository.findByUserUuid(userUuid)
                .orElseThrow(() -> new BaseException(BaseResponseStatus.NO_EXIST_USER));


        PageRequest pr = PageRequest.of(0, 20);
        Page<StayCardDto> page = stayRepository.fetchCardsBy(
                lastStayId,
                stayQuery.getSubRegionId(),
                stayQuery.getCheckIn(),
                stayQuery.getCheckout(),
                user.getLanguage().getDescription(),
                pr
        );

        return page.getContent();


    }

    @Override
    public List<StayCardByWishDto> searchStayByWish(String userUuid) {

        UserEntity user = userRepository.findByUserUuid(userUuid)
                .orElseThrow(() -> new BaseException(BaseResponseStatus.NO_EXIST_USER));

        return stayRepository.findTop12ByWish(
                user.getLanguage().getDescription()
        );
    }

    @Override
    public List<StayCardDto> searchStayByRating(String userUuid) {
        UserEntity user = userRepository.findByUserUuid(userUuid)
                .orElseThrow(() -> new BaseException(BaseResponseStatus.NO_EXIST_USER));

        return stayRepository.findTop12ByRating(
                user.getLanguage().getDescription()
        );
    }

    @Override
    public List<StayChatResponseDto> getStays(List<StayChatRequestDto> stayChatListDto, String userUuid) {
        UserEntity user = userRepository.findByUserUuid(userUuid)
                .orElseThrow(() -> new BaseException(BaseResponseStatus.NO_EXIST_USER));

        List<Long> list = stayChatListDto.stream().map(StayChatRequestDto::stayId).toList();

        return stayRepository.findChatInfo(user.getLanguage().getDescription(), list);
    }
}
