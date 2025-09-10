import { create } from 'zustand';
import type { CreateStayInput } from '@/features/create-stay/schema';

type CreateStayView = 'form' | 'searchAddress';

interface CreateStayState {
  currentStep: number;
  formData: Partial<CreateStayInput>;
  view: CreateStayView;
}

interface CreateStayActions {
  setStep: (step: number) => void;
  setFormData: (data: Partial<CreateStayInput>) => void;
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
