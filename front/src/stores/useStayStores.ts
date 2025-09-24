'use client';

import { create } from 'zustand';
import { createStay } from '@/services/stay.api';
import type { CreateStayRequest } from '@/services/stay.types';
import type { AxiosResponse } from 'axios';

type ViewMode = 'form' | 'searchAddress';

interface StayStore extends CreateStayRequest {
  stayId: number | null;
  currentStep: number;
  view: ViewMode;
  loading: boolean;
  error: string | null;
  thumbnail: any | null;

  translateStayUuid: string;
  sseUuid: string;

  setField: (field: keyof StayStore, value: any) => void;
  setStep: (step: number) => void;
  setView: (view: ViewMode) => void;
  reset: () => void;
  submit: () => Promise<boolean | null>;
}

export const useStayStores = create<StayStore>((set, get) => ({
  stayId: null,
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

  translateStayUuid: '',
  sseUuid: '',

  setField: (field, value) =>
    set((state) => {
      if (field === 'imageRequestList') {
        const firstImage = (value as any[])?.[0] ?? null;
        return { imageRequestList: value, thumbnail: firstImage };
      }
      return { ...state, [field]: value };
    }),

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
      translateStayUuid: '',
      sseUuid: '',
    }),

  submit: async () => {
    set({ loading: true, error: null });
    try {
      const {
        thumbnail,
        currentStep,
        view,
        loading,
        error,
        stayId,
        translateStayUuid,
        sseUuid,
        ...payload
      } = get();

      console.log(translateStayUuid, sseUuid);
      if (!translateStayUuid || !sseUuid || translateStayUuid !== sseUuid) {
        set({ loading: false, error: '번역이 완료되지 않았습니다. 다시 시도해주세요.' });
        return false;
      }

      const res: AxiosResponse = await createStay(payload as CreateStayRequest);
      if (res.isSuccess) {
        set({ loading: false });
        return true;
      }

      set({ loading: false, error: '숙소 생성에 실패했습니다.' });
      return false;
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
