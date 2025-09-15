import { create } from 'zustand';
import type { CreateStayInput } from '@/features/create-stay/schema';
import type { DateRange } from 'react-day-picker';
import type { AmenitiesSelection } from '@/features/create-stay/constants/amenities';

type CreateStayView = 'form' | 'searchAddress';

type CreateStayFormData = Partial<CreateStayInput> & {
  description?: string;
  amenities?: AmenitiesSelection;
  unavailableRanges?: DateRange[];
  addressEng?: string;
};

interface CreateStayState {
  currentStep: number;
  formData: CreateStayFormData;
  view: CreateStayView;
}

interface CreateStayActions {
  setStep: (step: number) => void;
  setFormData: (data: Partial<CreateStayFormData>) => void;
  setView: (view: CreateStayView) => void;
  reset: () => void;
}

const initialState: CreateStayState = {
  currentStep: 1,
  formData: {},
  view: 'form',
};

export const useCreateStayStore = create<CreateStayState & CreateStayActions>((set) => ({
  ...initialState,
  setStep: (step) => set({ currentStep: step }),
  setFormData: (data) =>
    set((state) => ({
      formData: { ...state.formData, ...data },
    })),
  setView: (view) => set({ view }),
  reset: () => set(initialState),
}));
