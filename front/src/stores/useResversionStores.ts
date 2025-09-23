'use client';

import { create } from 'zustand';
import type {
  CreateReservationRequest,
  CreateReservationResponse,
} from '@/services/reservation.types';
import { submitReservation } from '@/services/submitReservation';
import { W3SSdk } from '@circle-fin/w3s-pw-web-sdk';
import { useSdkStore } from '@/stores/useSdkStores';

const sdk = new W3SSdk();

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

  sdkInitData: null,

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
      const { sdkInitData } = useSdkStore.getState();
      if (!sdkInitData) {
        throw new Error('지갑 연결 정보가 없습니다. 먼저 지갑을 연결하세요.');
      }
      const result = await submitReservation(state, sdkInitData);
      set({ reservation: result, loading: false });
      return result;
    } catch (err: any) {
      console.error(err);
      set({
        loading: false,
        error: err.message || '예약 처리 중 오류 발생',
      });
      return null;
    }
  },
}));
