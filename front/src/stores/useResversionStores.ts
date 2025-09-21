'use client';

import { create } from 'zustand';
import { createReservation } from '@/services/reservation.api';
import type {
  CreateReservationRequest,
  CreateReservationResponse,
} from '@/services/reservation.types';
import { makeReservationId } from '@/utils/makeReservationId';

type ViewMode = 'form' | 'searchAddress';

interface ReservationStore extends CreateReservationRequest {
  currentStep: number;
  view: ViewMode;
  loading: boolean;
  error: string | null;
  reservation: CreateReservationResponse['result'] | null;

  setField: (field: keyof CreateReservationRequest, value: any) => void;
  setStep: (step: number) => void;
  setView: (view: ViewMode) => void;
  reset: () => void;
  submit: () => Promise<CreateReservationResponse['result'] | null>;
}

export const useReservationStore = create<ReservationStore>((set, get) => ({
  reservationId: '',
  stayId: 0,
  checkinDate: '',
  checkoutDate: '',
  night: 0,
  reservationDate: '',
  payment: 0,
  stayTitle: '',
  stayTitleEng: '',
  reviewed: false,
  cancled: false,
  settlemented: false,

  currentStep: 1,
  view: 'form',

  reservation: null,
  loading: false,
  error: null,

  setField: (field, value) => set({ [field]: value } as Partial<ReservationStore>),

  setStep: (step) => set({ currentStep: step }),
  setView: (view) => set({ view }),

  reset: () =>
    set({
      reservationId: '',
      stayId: 0,
      checkinDate: '',
      checkoutDate: '',
      night: 0,
      reservationDate: '',
      payment: 0,
      stayTitle: '',
      stayTitleEng: '',
      reviewed: false,
      cancled: false,
      settlemented: false,
      reservation: null,
      currentStep: 1,
      view: 'form',
      loading: false,
      error: null,
    }),

  submit: async () => {
    set({ loading: true, error: null });
    try {
      const state = get();

      // 서버 스펙에 맞는 값만 추출
      const body: CreateReservationRequest = {
        reservationId: makeReservationId(),
        stayId: state.stayId,
        checkinDate: state.checkinDate,
        checkoutDate: state.checkoutDate,
        reservationDate: new Date().toISOString(), // 현재 시각
        payment: state.payment,
        // stayTitle: state.stayTitle,
        // stayTitleEng: state.stayTitleEng,
        // reviewed: state.reviewed,
        // cancled: state.cancled,
        // settlemented: state.settlemented,
      };

      const res = await createReservation(body);

      if (res.isSuccess) {
        set({ reservation: res.result, loading: false });
        return res.result;
      } else {
        set({
          error: res.message || '예약 등록 실패',
          loading: false,
        });
        return null;
      }
    } catch (err: any) {
      console.error(err);
      set({
        loading: false,
        error: err.response?.data?.message || '예약 등록 중 오류가 발생했습니다.',
      });
      return null;
    }
  },
}));
