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
}

export interface UpdateStayRequest extends CreateStayRequest {
  id: number;
}

export interface StayDetailResponse {
  id: number;
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
  images: string[];
  facilities: number[];
  blockRangeList: BlockRangeDto[];
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
