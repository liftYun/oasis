'use client';

import { http } from '@/apis/httpClient';
import type {
  CreateReservationRequest,
  CreateReservationResponse,
  BlockChainReservationResponse,
  BaseResponse,
  UserSearchResultResponseVo,
  ReservationResponseDto,
  RegistReviewRequestVo,
  StayReviewResponseVo,
  ReviewDetailResponseVo,
  ReviewResponseVo,
} from './reservation.types';

// 예약 등록 (DB에 저장)
export const createReservation = (body: CreateReservationRequest) =>
  http.post<CreateReservationResponse>('/api/v1/reservation', body);

// 예약 등록 (BlockChain 저장 Approve)
export const approveReservation = (body: CreateReservationRequest) =>
  http.post<BlockChainReservationResponse>('/api/v1/reservation/approve', body);

// 예약 등록 (BlockChain 저장 Lock)
export const lockReservation = (body: CreateReservationRequest) =>
  http.post<BlockChainReservationResponse>('/api/v1/reservation/lock', body);

// 예약 상세 조회
export const fetchReservationDetail = (reservationId: string) =>
  http.get<CreateReservationResponse>(`/api/v1/reservation/${reservationId}`);

// 예약 취소
export const cancelReservation = (reservationId: string) =>
  http.put(`/api/v1/reservation/${reservationId}/cancel`);

// 예약 목록 조회
export const fetchReservations = () =>
  http.get<BaseResponse<{ reservations: ReservationResponseDto[] }>>('/api/v1/reservation/list');

// 회원 검색
export const searchUsers = async (
  q: string,
  page: number,
  size: number,
  excludeIds: number[] = []
): Promise<BaseResponse<UserSearchResultResponseVo>> => {
  const params = excludeIds.map((id) => `exclude=${id}`).join('&');
  const query = params ? `?${params}` : '';

  const url = `/api/v1/user/search/${q}/${page}/${size}${query}`;

  const res = await http.get<BaseResponse<UserSearchResultResponseVo>>(url);
  return res;
};

// 숙소 리뷰 작성
export const registReview = (body: RegistReviewRequestVo) =>
  http.post<BaseResponse<void>>('/api/v1/review/regist', body);

// 특정 숙소 리뷰 목록 조회
export const fetchStayReviews = (stayId: number) =>
  http.get<BaseResponse<StayReviewResponseVo[]>>(`/api/v1/review/${stayId}`);

// 리뷰 상세 조회
export const fetchReviewDetail = (reviewId: number) =>
  http.get<BaseResponse<ReviewDetailResponseVo>>(`/api/v1/review/detail/${reviewId}`);

// 내가 작성한 리뷰 목록 조회
export const fetchMyReviews = () =>
  http.get<BaseResponse<ReviewResponseVo[]>>('/api/v1/review/list');
