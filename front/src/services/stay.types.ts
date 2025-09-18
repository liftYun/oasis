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

export interface CreateStayRequest {
  title: string;
  location: string;
  pricePerNight: number;
  guestCount: number;
  description: string;
  latitude: number;
  longitude: number;
  imageRequestList: ImageRequest[];
}

export interface UpdateStayRequest extends CreateStayRequest {
  id: number;
}

export interface StayDetailResponse {
  id: number;
  title: string;
  location: string;
  pricePerNight: number;
  guestCount: number;
  description: string;
  latitude: number;
  longitude: number;
  images: string[];
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

export interface StayCardDto {
  stayId: number;
  title: string;
  thumbnail: string;
  rating: number;
  price: number;
}

export interface WishResponseDto {
  id: number;
  stayCardDto: StayCardDto;
}
