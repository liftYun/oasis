import { create } from 'zustand';
import type { CreateStayInput } from '@/features/create-stay/schema';

interface CreateStayState {
  currentStep: number;
  formData: Partial<CreateStayInput>;
}

interface CreateStayActions {
  setStep: (step: number) => void;
  setFormData: (data: Partial<CreateStayInput>) => void;
  reset: () => void;
}

const initialState: CreateStayState = {
  currentStep: 1,
  formData: {},
};

export const useCreateStayStore = create<CreateStayState & CreateStayActions>((set) => ({
  ...initialState,
  setStep: (step) => set({ currentStep: step }),
  setFormData: (data) =>
    set((state) => ({
      formData: { ...state.formData, ...data },
    })),
  reset: () => set(initialState),
}));
