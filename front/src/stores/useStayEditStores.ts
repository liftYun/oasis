'use client';

import { create } from 'zustand';
import { updateStay } from '@/services/stay.api';
import type {
  CreateStayRequest,
  StayReadResponseDto,
  UpdateStayRequest,
} from '@/services/stay.types';

interface StayStore extends CreateStayRequest {
  currentStep: number;
  view: 'form' | 'searchAddress';
  loading: boolean;
  error: string | null;
  stayId: number | null;

  setField: (field: keyof CreateStayRequest, value: any) => void;
  setStep: (step: number) => void;
  setView: (view: 'form' | 'searchAddress') => void;
  setStayData: (data: StayReadResponseDto) => void;
  reset: () => void;
  submit: () => Promise<number | null>;
}

// 유틸 함수들
const toS3Key = (url: string): string => {
  try {
    const u = new URL(url);
    return u.pathname.replace(/^\/+/, '');
  } catch {
    return url.startsWith('/') ? url.slice(1) : url;
  }
};

const toNumber = (v: unknown): number | undefined =>
  v === '' || v == null ? undefined : Number(v);

const trimOrEmpty = (v?: string) => (v ? v.trim() : '');

// Zustand store
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
  stayId: null,

  // 필드 세팅
  setField: (field, value) =>
    set((state) => {
      if (field === 'imageRequestList') {
        const firstImage = (value as any[])?.[0] ?? null;
        return { imageRequestList: value, thumbnail: firstImage };
      }
      return { [field]: value } as Partial<StayStore>;
    }),

  setStep: (step) => set({ currentStep: step }),
  setView: (view) => set({ view }),

  // 데이터 초기화
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
      stayId: null,
    }),

  // 상세 조회 → 폼 세팅
  setStayData: (detail: StayReadResponseDto) =>
    set({
      stayId: detail.stayId,
      title: detail.title ?? '',
      description: detail.description ?? '',
      price: detail.price ?? 0,
      postalCode: detail.postalCode ?? '',
      maxGuest: detail.maxGuest ?? 1,
      address: detail.addressLine ?? detail.address ?? '',
      addressEng: detail.addressLineEng ?? detail.addressEng ?? '',
      addressDetail: detail.addrDetail ?? detail.addressDetail ?? '',
      addressDetailEng: detail.addrDetailEng ?? detail.addressDetailEng ?? '',
      subRegionId: detail.subRegionId,
      imageRequestList: detail.photos.map((p) => ({
        id: p.id,
        key: toS3Key(p.url),
        sortOrder: p.sortOrder,
        url: p.url,
      })),
      facilities: detail.facilities.flatMap((f) => f.facilities.map((x) => x.id)),
      blockRangeList: detail.cancellations.map((c) => ({
        start: c.startDate,
        end: c.endDate,
      })),
      thumbnail: detail.photos[0]?.url ?? null,
    }),

  // 숙소 수정 요청
  submit: async () => {
    set({ loading: true, error: null });
    try {
      const s = get();
      if (!s.stayId) throw new Error('수정할 숙소 ID가 없습니다.');

      const updateBody = {
        subRegionId: s.subRegionId ?? 0,
        title: s.title ?? '',
        titleEng: s.titleEng ?? '',
        description: s.description ?? '',
        descriptionEng: s.descriptionEng ?? '',
        price: s.price ?? 0,
        address: s.address ?? '',
        addressEng: s.addressEng ?? '',
        postalCode: s.postalCode ?? '',
        addressDetail: s.addressDetail ?? '',
        addressDetailEng: s.addressDetailEng ?? '',
        maxGuest: s.maxGuest ?? 1,
        imageRequestList: (s.imageRequestList ?? []).map((img, idx) => ({
          id: img.id!,
          key: toS3Key(img.key),
          sortOrder: img.sortOrder ?? idx,
        })),
        facilities: s.facilities ?? [],
        blockRangeList: s.blockRangeList ?? [],
      } as UpdateStayRequest;

      console.log('[Stay Update Request]', updateBody);

      await updateStay(s.stayId, updateBody);
      set({ loading: false });
      return s.stayId;
    } catch (err: any) {
      console.error('[Stay Update Error]', err);
      set({
        loading: false,
        error: err?.response?.data?.message || '숙소 수정에 실패했습니다.',
      });
      return null;
    }
  },
}));
