'use client';

import { create } from 'zustand';
import { updateStay } from '@/services/stay.api';
import type { CreateStayRequest, StayReadResponseDto } from '@/services/stay.types';

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

function toS3Key(url: string): string {
  // 예) https://stay-oasis.s3.ap-northeast-2.amazonaws.com/stay-image/.../1.jpg
  // → stay-image/.../1.jpg
  try {
    const u = new URL(url);
    return u.pathname.replace(/^\/+/, ''); // 맨 앞 슬래시 제거
  } catch {
    // presigned 응답이나 이미 key가 온 경우 그대로 반환
    return url.startsWith('/') ? url.slice(1) : url;
  }
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

  stayId: null,

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

  setStayData: (detail: StayReadResponseDto) =>
    set({
      stayId: detail.stayId,
      title: detail.title,
      description: detail.description,
      price: detail.price,
      postalCode: detail.postalCode,
      maxGuest: detail.maxGuest,

      // address: `${detail.region ?? ''} ${detail.subRegion ?? ''}`.trim(),
      // addressEng: '',
      // addressDetail: '',
      // addressDetailEng: '',
      // 👉 실제 도로명 주소 / 상세주소
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

  submit: async () => {
    set({ loading: true, error: null });
    try {
      const { stayId, ...data } = get();
      if (!stayId) throw new Error('수정할 숙소 ID가 없습니다.');

      const updateBody = {
        // id: stayId,
        subRegionId: data.subRegionId,
        title: data.title,
        titleEng: data.titleEng,
        description: data.description,
        descriptionEng: data.descriptionEng,
        price: data.price,
        address: data.address,
        addressEng: data.addressEng,
        postalCode: data.postalCode,
        addressDetail: data.addressDetail,
        addressDetailEng: data.addressDetailEng,
        maxGuest: data.maxGuest,
        // imageRequestList: data.imageRequestList ?? [],
        imageRequestList: (data.imageRequestList ?? []).map(img => ({
          id: img.id,
          key: toS3Key(img.key),              // ✅ 서버에 key만 전달되도록 보정
          sortOrder: img.sortOrder,
        })),
        facilities: data.facilities ?? [],
        blockRangeList: data.blockRangeList ?? [],
      };

      await updateStay(stayId, updateBody);

      set({ loading: false });
      return stayId;
    } catch (err: any) {
      console.error(err);
      set({
        loading: false,
        error: err.response?.data?.message || '숙소 수정에 실패했습니다.',
      });
      return null;
    }
  },
}));
