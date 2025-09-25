'use client';

import { create } from 'zustand';
import { createStay } from '@/services/stay.api';
import type { CreateStayRequest } from '@/services/stay.types';
import { toast } from 'react-hot-toast';

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
    const { loading } = get();
    if (loading) return false;

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

      if (!translateStayUuid || !sseUuid || translateStayUuid !== sseUuid) {
        const msg = '번역이 완료되지 않았습니다. 다시 시도해주세요.';
        toast.error(msg);
        set({ loading: false, error: msg });
        return false;
      }

      const msg = '숙소 생성에 실패했습니다.';
      toast.error(msg);
      set({ loading: false, error: msg });
      return false;
    } catch (err: any) {
      console.error(err);
      const msg = err.response?.data?.message || '숙소 저장에 실패했습니다.';
      toast.error(msg);
      set({ loading: false, error: msg });
      return null;
    }
  },
}));
