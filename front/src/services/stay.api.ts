'use client';

import { http } from '@/apis/httpClient';
import type { AxiosResponse } from 'axios';
import {
  CreateStayRequest,
  UpdateStayRequest,
  StayReadResponseDto,
  PresignedRequest,
  PresignedResponse,
  WishResponseDto,
  RegionDto,
  BaseResponse,
  StayCardDto,
  StayCardByWishDto,
  StayRequestDto,
  StayReviewResponseVo,
  SaveStayRequest,
  ReviewDetailResponseVo,
  TranslateStayResponse,
} from './stay.types';

// 숙소 등록
export const createStay = (body: CreateStayRequest) =>
  http.post<BaseResponse<{ stayId: number }>>('/api/v1/stay', body);

// 숙소 수정
export const updateStay = (stayId: number, body: UpdateStayRequest) =>
  http.put<BaseResponse<{ stayId: number }>>(`/api/v1/stay/${stayId}`, body);

// 숙소 삭제
export const deleteStay = (stayId: number) =>
  http.delete<BaseResponse<null>>(`/api/v1/stay/${stayId}`, {
    headers: { Accept: 'application/json' },
    withCredentials: true,
  });

// 숙소 상세 조회
export const fetchStayDetail = (stayId: number) =>
  http.get<BaseResponse<StayReadResponseDto>>(`/api/v1/stay/${stayId}`);

// 사진 업로드 URL 발급
export const getPresignedUrls = (imageInfos: PresignedRequest[]) =>
  http.post<BaseResponse<PresignedResponse[]>>('/api/v1/stay/photos/upload-url', { imageInfos });

// 숙소 번역
export const translateStay = (body: StayRequestDto) =>
  http.post<BaseResponse<TranslateStayResponse>>('/api/v1/stay/translate', body);

// 숙소 검색
export const searchStays = (params?: Record<string, any>) =>
  http.get<BaseResponse<StayCardDto[]>>('/api/v1/stay', { params });

// 숙소 검색 (관심 많은 순)
export const searchStaysByWish = () =>
  http.get<BaseResponse<StayCardByWishDto[]>>('/api/v1/stay/rank/wish');

// 숙소 검색 (평점 높은 순)
export const searchStaysByRating = () =>
  http.get<BaseResponse<StayCardByWishDto[]>>('/api/v1/stay/rank/rating');

// 지역 조회
export const fetchRegions = () => http.get<BaseResponse<RegionDto[]>>('/api/v1/stay/region');

// 관심 숙소 등록
export const addWish = (stayId: number) => http.post<BaseResponse<void>>(`/api/v1/wish/${stayId}`);

// 관심 숙소 목록 조회
export const fetchWishes = () => http.get<BaseResponse<WishResponseDto[]>>('/api/v1/wish');

// 관심 숙소 삭제
export const deleteWish = (wishId: number) =>
  http.delete<BaseResponse<void>>(`/api/v1/wish/${wishId}`);

// 숙소 리뷰 목록 조회
export const fetchStayReviews = (stayId: number) =>
  http.get<BaseResponse<StayReviewResponseVo[]>>(`/api/v1/review/${stayId}`);

// 리뷰 상세 조회 (본인만 가능)
export const fetchReviewDetail = (reviewId: number) =>
  http.get<BaseResponse<ReviewDetailResponseVo>>(`/api/v1/review/detail/${reviewId}`);

// 숙소 등록/수정 (통합)
export const saveStay = (body: SaveStayRequest) => {
  if (body.mode === 'create') {
    return createStay(body as CreateStayRequest);
  } else {
    return updateStay(body.id, body as UpdateStayRequest);
  }
};
