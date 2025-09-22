'use client';

import { create } from 'zustand';
// import { createReservation, approveReservation } from '@/services/reservation.api';
import type {
  CreateReservationRequest,
  CreateReservationResponse,
} from '@/services/reservation.types';
// import { makeReservationId } from '@/utils/makeReservationId';
import { submitReservation } from '@/services/submitReservation';
import { W3SSdk } from '@circle-fin/w3s-pw-web-sdk';
import type { SdkInitData } from '@/features/my-profile/components/blockchain/types';
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

  // submit: async () => {
  //   set({ loading: true, error: null });
  //   try {
  //     const state = get();
  //     const reservationId = makeReservationId();

  //     // 예약 등록 (DB에 저장)
  //     const body: CreateReservationRequest = {
  //       reservationId: reservationId,
  //       stayId: state.stayId,
  //       checkinDate: state.checkinDate,
  //       checkoutDate: state.checkoutDate,
  //       reservationDate: new Date().toISOString(), // 현재 시각
  //       payment: state.payment,
  //       // stayTitle: state.stayTitle,
  //       // stayTitleEng: state.stayTitleEng,
  //       // reviewed: state.reviewed,
  //       // cancled: state.cancled,
  //       // settlemented: state.settlemented,
  //     };
  //     const res = await createReservation(body);
  //     if (res.isSuccess) {
  //       set({ reservation: res.result, loading: false });
  //       return res.result;
  //     } else {
  //       set({
  //         error: res.message || '예약 등록 실패',
  //         loading: false,
  //       });
  //       return null;
  //     }
  //   } catch (err: any) {
  //     console.error(err);
  //     set({
  //       loading: false,
  //       error: err.response?.data?.message || '예약 등록 중 오류가 발생했습니다.',
  //     });
  //     return null;
  //   }
  // },

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
