'use client';

import { http } from '@/apis/httpClient';
import type { AxiosResponse } from 'axios';
import type {
  CreateReservationRequest,
  CreateReservationResponse,
  BaseResponse,
  UserSearchResultResponseVo,
} from './reservation.types';

// 예약 등록
export const createReservation = (body: CreateReservationRequest) =>
  http.post<CreateReservationResponse>('/api/v1/reservation', body);

// 예약 상세 조회
export const fetchReservationDetail = (reservationId: string) =>
  http.get<CreateReservationResponse>(`/api/v1/reservation/${reservationId}`);

// 예약 취소
export const cancelReservation = (reservationId: string) =>
  http.put(`/api/v1/reservation/${reservationId}/cancel`);

// 예약 목록 조회
export const fetchReservations = (params?: Record<string, any>) =>
  http.get<CreateReservationResponse[]>('/api/v1/reservation', { params });

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
