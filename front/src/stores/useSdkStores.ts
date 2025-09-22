'use client';

import { create } from 'zustand';
import type { SdkInitData } from '@/features/my-profile/components/blockchain/types';

interface SdkStore {
  sdkInitData: SdkInitData | null;
  setSdkInitData: (data: SdkInitData) => void;
  reset: () => void;
}

export const useSdkStore = create<SdkStore>((set) => ({
  sdkInitData: null,
  setSdkInitData: (data) => set({ sdkInitData: data }),
  reset: () => set({ sdkInitData: null }),
}));
