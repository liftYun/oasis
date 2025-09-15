'use client';

import { http } from '@/apis/httpClient';

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

export const getStayDetail = (id: number) => http.get<StayDetailResponse>(`/api/v1/stay/${id}`);
