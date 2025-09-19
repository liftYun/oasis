import { create } from 'zustand';
import type { DateRange } from 'react-day-picker';

export type ReservationStep = 1 | 2 | 3;

interface ReservationState {
  step: ReservationStep;
  dateRange?: DateRange;
}

interface ReservationActions {
  setStep: (step: ReservationStep) => void;
  setDateRange: (range: DateRange | undefined) => void;
  reset: () => void;
}

const initialState: ReservationState = {
  step: 1,
  dateRange: undefined,
};

export const useReservationStore = create<ReservationState & ReservationActions>((set) => ({
  ...initialState,
  setStep: (step) => set({ step }),
  setDateRange: (dateRange) => set({ dateRange }),
  reset: () => set(initialState),
}));
