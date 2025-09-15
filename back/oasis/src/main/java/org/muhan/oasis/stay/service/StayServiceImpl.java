package org.muhan.oasis.stay.service;

import lombok.RequiredArgsConstructor;
import org.muhan.oasis.common.base.BaseResponse;
import org.muhan.oasis.common.base.BaseResponseStatus;
import org.muhan.oasis.common.exception.BaseException;
import org.muhan.oasis.openAI.dto.in.AddrRequestDto;
import org.muhan.oasis.openAI.dto.in.StayRequestDto;
import org.muhan.oasis.openAI.dto.out.StayTranslationResultDto;
import org.muhan.oasis.s3.service.S3StorageService;
import org.muhan.oasis.stay.dto.in.CreateStayRequestDto;
import org.muhan.oasis.stay.dto.in.ImageRequestDto;
import org.muhan.oasis.stay.dto.in.StayQueryRequestDto;
import org.muhan.oasis.stay.dto.out.StayCardByWishDto;
import org.muhan.oasis.stay.dto.out.StayCardDto;
import org.muhan.oasis.stay.dto.out.StayResponseDto;
import org.muhan.oasis.stay.dto.out.StayReadResponseDto;
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

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
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

    @Override
    @Transactional
    public StayResponseDto registStay(CreateStayRequestDto stayRequest, Long userId) {

        UserEntity user = userRepository.findByUserId(userId).orElseThrow(() -> new BaseException(BaseResponseStatus.NO_EXIST_USER));

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
        return StayReadResponseDto.from(stay, facilities, language);
    }

    @Override
    @Transactional
    public StayResponseDto updateStay(Long stayId) {
        return null;
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
}
