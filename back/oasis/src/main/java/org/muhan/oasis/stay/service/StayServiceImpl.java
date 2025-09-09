package org.muhan.oasis.stay.service;

import lombok.RequiredArgsConstructor;
import org.muhan.oasis.common.base.BaseResponseStatus;
import org.muhan.oasis.common.exception.BaseException;
import org.muhan.oasis.openAI.dto.in.AddrRequestDTO;
import org.muhan.oasis.openAI.dto.in.StayRequestDTO;
import org.muhan.oasis.openAI.dto.out.AddrTranslationResult;
import org.muhan.oasis.openAI.dto.out.StayTranslationResult;
import org.muhan.oasis.openAI.service.OpenAIService;
import org.muhan.oasis.s3.service.S3StorageService;
import org.muhan.oasis.stay.dto.in.CreateStayRequestDto;
import org.muhan.oasis.stay.dto.out.StayCreateResponseDto;
import org.muhan.oasis.stay.dto.out.StayReadResponseDto;
import org.muhan.oasis.stay.entity.*;
import org.muhan.oasis.stay.repository.*;
import org.muhan.oasis.user.entity.UserEntity;
import org.muhan.oasis.user.repository.UserRepository;
import org.muhan.oasis.valueobject.Language;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StayServiceImpl implements StayService{

    private final UserRepository userRepository;
    private final OpenAIService openAIService;
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
    public StayCreateResponseDto registStay(CreateStayRequestDto stayRequest, Long userId) {

        UserEntity user = userRepository.findByUserId(userId).orElseThrow(() -> new BaseException(BaseResponseStatus.NO_EXIST_USER));

        // 영어 번역하기 or 한국어 번역하기
        StayTranslationResult translation = openAIService.getTranslatedStay(new StayRequestDTO(stayRequest.getTitle(), stayRequest.getDescription()));

        // 상세 주소
        AddrTranslationResult addrDetail = openAIService.getTranslatedAddr(new AddrRequestDTO(stayRequest.getAddressDetail()));

        // subRegion 찾기
        Long subRegionId = stayRequest.getSubRegionId();

        SubRegionEntity subRegion = subRegionRepository.findById(subRegionId)
                .orElseThrow(() -> new BaseException(BaseResponseStatus.NO_EXIST_SUBREGION));
        SubRegionEngEntity subRegionEng = subRegionEngRepository.findById(subRegionId)
                .orElseThrow(() -> new BaseException(BaseResponseStatus.NO_EXIST_SUBREGION));

        // 취소정책 찾기
        CancellationPolicyEntity cancellationPolicy =
                Optional.ofNullable(user.getCancellationPolicy())
                        .orElseThrow(() -> new BaseException(BaseResponseStatus.NO_EXIST_CANCELLATION_POLICY));

        // 숙소 이름, 설명, 가격, 주소, 우편번호, 수용인원, 썸네일, 지역으로 생성
        StayEntity stay =
                stayRepository.save(StayEntity.builder()
                .title(translation.getKorTitle())
                .titleEng(translation.getEngTitle())
                .description(translation.getKorContent())
                .descriptionEng(translation.getEngContent())
                .price(stayRequest.getPrice())
                .addressLine(stayRequest.getAddress())
                .addressLineEng(stayRequest.getAddressEng())
                .postalCode(stayRequest.getPostalCode())
                .maxGuests(stayRequest.getMaxGuest())
                .thumbnail(s3StorageService.toPublicUrl(stayRequest.getThumbnail()))
                .subRegionEntity(subRegion)
                .subRegionEngEntity(subRegionEng)
                .user(user)
                .cancellationPolicyEntity(cancellationPolicy)
                .addrDetail(addrDetail.getKorDetailAddr())
                .addrDetailEng(addrDetail.getEngDetailAddr())
                .build());

        // 디바이스 생성
        DeviceEntity device = deviceRepository.save(
                DeviceEntity.builder()
                .stayName(translation.getKorTitle())
                .stayNameEng(translation.getEngTitle())
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
        List<StayPhotoEntity> photoList = stayPhotoRepository.saveAll(
                Optional.ofNullable(stayRequest.getImageRequestList()).orElseGet(List::of).stream()
                        .map(dto -> {
                            String url = s3StorageService.toPublicUrl(dto.key());
                            return StayPhotoEntity.from(dto, stay, url);
                        }).toList());

        stay.attachDevice(device);
        stay.attachRatingSummary(ratingSummary);

        stay.addPhotos(photoList);

        return StayCreateResponseDto.builder()
                .stayId(stay.getId()).build();
    }

    @Override
    @Transactional(readOnly = true)
    public StayReadResponseDto getStayById(Long stayId, Language language) {
        StayEntity stay = stayRepository.findById(stayId).orElseThrow(() -> new BaseException(BaseResponseStatus.NO_STAY));
        return StayReadResponseDto.from(stay, language);
    }


}
