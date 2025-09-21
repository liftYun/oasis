'use client';

import { create } from 'zustand';
import { createStay, updateStay } from '@/services/stay.api';
import type { CreateStayRequest, StayReadResponseDto } from '@/services/stay.types';
import type { AxiosResponse } from 'axios';

type ViewMode = 'form' | 'searchAddress';
type Mode = 'create' | 'edit';

interface StayStore extends CreateStayRequest {
  currentStep: number;
  view: ViewMode;
  loading: boolean;
  error: string | null;

  mode: Mode;
  stayId?: number;

  setField: (field: keyof CreateStayRequest, value: any) => void;
  setStep: (step: number) => void;
  setView: (view: ViewMode) => void;
  setMode: (mode: Mode, stayId?: number) => void;
  setStayData: (data: StayReadResponseDto) => void;
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

  mode: 'create',
  stayId: undefined,

  setField: (field, value) => set({ [field]: value } as Partial<StayStore>),
  setStep: (step) => set({ currentStep: step }),
  setView: (view) => set({ view }),
  setMode: (mode, stayId) => set({ mode, stayId }),

  setStayData: (detail: StayReadResponseDto) =>
    set({
      stayId: detail.stayId,
      title: detail.title,
      description: detail.description,
      price: detail.price,
      postalCode: detail.postalCode,
      maxGuest: detail.maxGuest,
      imageRequestList: detail.photos.map((p) => ({
        key: p.url,
        sortOrder: p.sortOrder,
      })),
      facilities: detail.facilities.flatMap((f) => f.facilities.map((x) => x.id)),
      blockRangeList: detail.cancellations.map((c) => ({
        start: c.startDate,
        end: c.endDate,
      })),
      thumbnail: detail.photos[0]?.url ?? null,
    }),

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
      mode: 'create',
      stayId: undefined,
    }),

  submit: async () => {
    set({ loading: true, error: null });
    try {
      const body = { ...get() };

      if (get().mode === 'create') {
        const res: AxiosResponse = await createStay(body);
        const locationHeader = res.headers['location'];
        const stayId = locationHeader?.split('/').pop();
        set({ loading: false });
        return stayId ? Number(stayId) : null;
      } else {
        if (!get().stayId) throw new Error('수정할 숙소 ID가 없습니다.');
        await updateStay(get().stayId!, {
          ...body,
          id: get().stayId!,
        });
        set({ loading: false });
        return get().stayId!;
      }
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
