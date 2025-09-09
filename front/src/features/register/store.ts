'use client';

import { create } from 'zustand';

type Step = 'nickname' | 'check' | 'role';

interface RegisterState {
  step: Step;
  email: string;
  profileImage: File | string | null;
  nickname: string;

  setEmail: (v: string) => void;
  setProfileImage: (v: File | string | null) => void;
  setNickname: (v: string) => void;

  next: () => void;
  prev: () => void;
  goTo: (s: Step) => void;
}

export const useRegisterStore = create<RegisterState>((set, get) => ({
  step: 'nickname',
  email: '',
  profileImage: null,
  nickname: '',

  setEmail: (v) => set({ email: v }),
  setProfileImage: (v) => set({ profileImage: v }),
  setNickname: (v) => set({ nickname: v }),

  next: () => {
    const { step } = get();
    console.log('before step:', step);
    if (step === 'nickname') set({ step: 'check' });
    else if (step === 'check') set({ step: 'role' });
    console.log('after step:', get().step);
  },

  prev: () => {
    const { step } = get();
    if (step === 'role') set({ step: 'check' });
    else if (step === 'check') set({ step: 'nickname' });
  },

  goTo: (s) => set({ step: s }),
}));
