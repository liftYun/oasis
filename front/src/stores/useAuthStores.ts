'use client';
import { create } from 'zustand';

type UserRole = 'guest' | 'host';

interface AuthState {
  accessToken: string | null;
  role: UserRole | null;
  setAccessToken: (token: string | null) => void;
  setRole: (role: UserRole | null) => void;
  setUser: (user: { accessToken: string; role?: UserRole }) => void;
  clear: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  role: null,

  setAccessToken: (token) => set({ accessToken: token }),
  setRole: (role) => set({ role }),

  setUser: ({ accessToken, role }) =>
    set({
      accessToken,
      role: role ?? null,
    }),

  clear: () => set({ accessToken: null, role: null }),
}));
