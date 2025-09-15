'use client';
import { create } from 'zustand';

type UserRole = 'guest' | 'host';

interface AuthState {
  accessToken: string | null;
  role: UserRole | null;
  nickname: string | null;

  setAccessToken: (token: string | null) => void;
  setRole: (role: UserRole | null) => void;
  setNickname: (nickname: string | null) => void;
  setUser: (user: { accessToken: string; role?: UserRole; nickname?: string }) => void; // ✅ 확장
  clear: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  role: null,
  nickname: null,

  setAccessToken: (token) => set({ accessToken: token }),
  setRole: (role) => set({ role }),
  setNickname: (nickname) => set({ nickname }),

  setUser: ({ accessToken, role, nickname }) =>
    set({
      accessToken,
      role: role ?? null,
      nickname: nickname ?? null,
    }),

  clear: () => set({ accessToken: null, role: null, nickname: null }),
}));
