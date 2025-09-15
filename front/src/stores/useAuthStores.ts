'use client';
import { create } from 'zustand';

interface AuthState {
  accessToken: string | null;
  role: 'guest' | 'host' | null;
  setUser: (user: { accessToken: string; role?: 'guest' | 'host' }) => void;
  clear: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  role: null,
  setUser: ({ accessToken, role }) => set({ accessToken, role: role ?? null }),
  clear: () => set({ accessToken: null, role: null }),
}));
