'use client';

export interface ImageRequest {
  key: string;
  sortOrder: number;
}

export interface PresignedRequest {
  sortOrder: number;
  contentType: string;
}

export interface PresignedResponse {
  sortOrder: number;
  key: string;
  uploadUrl: string;
  publicUrl: string;
}

export interface BlockRangeDto {
  start: string; // YYYY-MM-DD
  end: string; // YYYY-MM-DD
}

export interface StayRequestDto {
  detailAddress: string;
  title: string;
  content: string;
  language: 'KOR' | 'ENG';
}

export interface StayTranslationResultDto {
  detailAddress: string;
  title: string;
  content: string;
}

export interface CreateStayRequest {
  subRegionId: number;
  title: string;
  titleEng: string;
  description: string;
  descriptionEng: string;
  price: number;
  address: string;
  addressEng: string;
  addressDetail: string;
  addressDetailEng: string;
  postalCode: string;
  maxGuest: number;
  imageRequestList: ImageRequest[];
  facilities?: number[];
  blockRangeList?: BlockRangeDto[];
  thumbnail?: string | null;
}

export interface UpdateStayRequest extends CreateStayRequest {
  id: number;
}

export type SaveStayRequest =
  | ({ mode: 'create' } & CreateStayRequest)
  | ({ mode: 'edit'; id: number } & CreateStayRequest);

/**
 * ✅ 숙소 상세 조회 응답
 */
export interface StayReadResponseDto {
  stayId: number;
  title: string;
  titleEng?: string; // ✅ 영문 제목 추가
  description: string;
  descriptionEng?: string; // ✅ 영문 설명 추가
  region: string;
  subRegion: string;
  subRegionId?: number; // ✅ 등록 요청과 매핑용
  postalCode: string;
  maxGuest: number;
  price: number;
  photos: ImageResponseDto[];
  review: StayReviewSummaryResponseDto;
  host: HostInfoResponseDto;
  facilities: FacilityCategoryResponseDto[];
  cancellations: StayBlockResponseDto[];
  reservedDate: ReservedResponseDto[];

  address?: string; // ✅ 상세 주소
  addressEng?: string;
  addressDetail?: string;
  addressDetailEng?: string;
}

export interface ImageResponseDto {
  url: string;
  sortOrder: number;
}

export interface StayReviewSummaryResponseDto {
  rating: number;
  count: number;
  highRateSummary: string;
  lowRateSummary: string;
}

export interface HostInfoResponseDto {
  nickname: string;
  uuid: string;
  url: string;
}

export interface FacilityCategoryResponseDto {
  category: string;
  facilities: FacilityResponseDto[];
}

export interface FacilityResponseDto {
  id: number;
  name: string;
}

export interface StayBlockResponseDto {
  startDate: string;
  endDate: string;
}

export interface ReservedResponseDto {
  checkIn: string;
  checkOut: string;
}

export interface SubRegionDto {
  id: number;
  subName: string;
}

export interface RegionDto {
  region: string;
  subRegions: SubRegionDto[];
}

export interface StayCardDto {
  stayId: number;
  title: string;
  thumbnail: string;
  rating: number;
  price: number;
}

export interface BaseResponse<T> {
  httpStatus: string;
  isSuccess: boolean;
  message: string;
  code: number;
  result: T;
}

export interface WishResponseDto {
  id: number;
  stayCardDto: StayCardDto;
}

export interface StayCardByWishDto {
  stayId: number;
  title: string;
  thumbnail: string | null;
  rating: number;
  price: number;
  wishCount?: number;
}

export interface StayReviewResponseVo {
  reviewId: number;
  reservationId?: string | null;
  rating: number;
  createdAt: string; // ISO-8601
  content: string;
  nickname: string;
}
