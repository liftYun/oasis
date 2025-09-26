'use client';

import { create } from 'zustand';

type Step = 'nickname' | 'check' | 'role';

interface RegisterState {
  step: Step;
  email: string;
  profileUrl: File | string | null;
  nickname: string;

  setEmail: (v: string) => void;
  setProfileUrl: (v: File | string | null) => void;
  setNickname: (v: string) => void;

  next: () => void;
  prev: () => void;
  goTo: (s: Step) => void;
}

export const useRegisterStore = create<RegisterState>((set, get) => ({
  step: 'nickname',
  email: '',
  profileUrl: null,
  nickname: '',

  setEmail: (v) => set({ email: v }),
  setProfileUrl: (v) => set({ profileUrl: v }),
  setNickname: (v) => set({ nickname: v }),

  next: () => {
    const { step } = get();
    if (step === 'nickname') set({ step: 'check' });
    else if (step === 'check') set({ step: 'role' });
  },

  prev: () => {
    const { step } = get();
    if (step === 'role') set({ step: 'check' });
    else if (step === 'check') set({ step: 'nickname' });
  },

  goTo: (s) => set({ step: s }),
}));
