'use client';

import { create } from 'zustand';
import { createStay } from '@/services/stay.api';
import type { CreateStayRequest } from '@/services/stay.types';
import type { AxiosResponse } from 'axios';

type ViewMode = 'form' | 'searchAddress';

interface StayStore extends CreateStayRequest {
  currentStep: number;
  view: ViewMode;
  loading: boolean;
  error: string | null;

  setField: (field: keyof CreateStayRequest, value: any) => void;
  setStep: (step: number) => void;
  setView: (view: ViewMode) => void;
  reset: () => void;
  submit: () => Promise<number | null>;
}

export const useStayStores = create<StayStore>((set, get) => ({
  subRegionId: 0,
  title: '',
  titleEng: '',
  description: '',
  descriptionEng: '',
  price: 0,
  address: '',
  addressEng: '',
  addressDetail: '',
  addressDetailEng: '',
  postalCode: '',
  maxGuest: 1,
  imageRequestList: [],
  facilities: [],
  blockRangeList: [],
  thumbnail: null,

  currentStep: 1,
  view: 'form',

  loading: false,
  error: null,

  setField: (field, value) => set({ [field]: value } as Partial<StayStore>),
  setStep: (step) => set({ currentStep: step }),
  setView: (view) => set({ view }),

  reset: () =>
    set({
      subRegionId: 0,
      title: '',
      titleEng: '',
      description: '',
      descriptionEng: '',
      price: 0,
      address: '',
      addressEng: '',
      addressDetail: '',
      addressDetailEng: '',
      postalCode: '',
      maxGuest: 1,
      imageRequestList: [],
      facilities: [],
      blockRangeList: [],
      thumbnail: null,
      currentStep: 1,
      view: 'form',
      loading: false,
      error: null,
    }),

  submit: async () => {
    set({ loading: true, error: null });
    try {
      const res: AxiosResponse = await createStay(get());
      const locationHeader = res.headers['location'];
      const stayId = locationHeader?.split('/').pop();
      set({ loading: false });
      return stayId ? Number(stayId) : null;
    } catch (err: any) {
      console.error(err);
      set({
        loading: false,
        error: err.response?.data?.message || '숙소 저장에 실패했습니다.',
      });
      return null;
    }
  },
}));
