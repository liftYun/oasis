'use client';

import { create } from 'zustand';
import { CreateStayRequest } from '@/services/stay.types';
import { createStay } from '@/services/stay.api';
import type { AxiosResponse } from 'axios';

interface StayStore extends CreateStayRequest {
  loading: boolean;
  error: string | null;

  setField: <K extends keyof CreateStayRequest>(field: K, value: CreateStayRequest[K]) => void;

  reset: () => void;

  submit: () => Promise<number | null>; // 성공 시 stayId 반환
}

export const useStayStores = create<StayStore>((set, get) => ({
  // 기본값 초기화
  title: '',
  location: '',
  pricePerNight: 0,
  guestCount: 1,
  description: '',
  latitude: 0,
  longitude: 0,
  imageRequestList: [],

  loading: false,
  error: null,

  setField: (field, value) => set({ [field]: value } as Partial<StayStore>),

  reset: () =>
    set({
      title: '',
      location: '',
      pricePerNight: 0,
      guestCount: 1,
      description: '',
      latitude: 0,
      longitude: 0,
      imageRequestList: [],
      error: null,
      loading: false,
    }),

  submit: async () => {
    set({ loading: true, error: null });
    try {
      const {
        title,
        location,
        pricePerNight,
        guestCount,
        description,
        latitude,
        longitude,
        imageRequestList,
      } = get();

      const body: CreateStayRequest = {
        title,
        location,
        pricePerNight,
        guestCount,
        description,
        latitude,
        longitude,
        imageRequestList,
      };

      const res = (await createStay(body)) as any;
      const locationHeader = res.headers['location'];
      const stayId = locationHeader?.split('/').pop();

      set({ loading: false });
      return stayId ? Number(stayId) : null;
    } catch (err: any) {
      console.error(err);
      set({
        loading: false,
        error: err.response?.data?.message || '숙소 등록에 실패했습니다.',
      });
      return null;
    }
  },
}));
