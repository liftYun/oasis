'use client';

import { http } from '@/apis/httpClient';

export interface ReservationResponseDto {
  reservationId: string;
  checkinDate: string;
  checkoutDate: string;
  reservationDate: string;
  stayTitle: string;
  stayTitleEng: string;
  thumbnail: string;
  addressLine: string;
  addressLineEng: string;
  isSettlemented: boolean;
  isReviewed: boolean;
  isCancled: boolean;
}

export interface RegistReviewRequestVo {
  reservationId: string;
  rating: number;
  originalContent?: string;
}

export interface ListOfReservationResponseVo {
  reservations: ReservationResponseDto[];
}

// 예약 내역 조회
export const fetchReservations = () =>
  http.get<{ result: ListOfReservationResponseVo }>('/api/v1/reservation/list');

// 리뷰 등록
export const registReview = (body: RegistReviewRequestVo) =>
  http.post('/api/v1/review/regist', body);
