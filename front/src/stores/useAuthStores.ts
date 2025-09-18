'use client';
import { create } from 'zustand';

type UserRole = 'guest' | 'host';

interface AuthState {
  accessToken: string | null;
  role: UserRole | null;
  nickname: string | null;
  email: string | null;
  profileUrl: string | null;
  uuid: string | null;

  // 부트스트랩 완료 여부
  initialized: boolean;
  setInitialized: (v: boolean) => void;

  setAccessToken: (token: string | null) => void;
  setRole: (role: UserRole | null) => void;
  setNickname: (nickname: string | null) => void;
  setUser: (user: {
    accessToken?: string;
    role?: UserRole;
    nickname?: string;
    email?: string;
    profileUrl?: string;
    uuid?: string;
  }) => void;
  clear: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  role: null,
  nickname: null,
  email: null,
  profileUrl: null,
  uuid: null,

  initialized: false,
  setInitialized: (v) => set({ initialized: v }),

  setAccessToken: (token) => set({ accessToken: token }),
  setRole: (role) => set({ role }),
  setNickname: (nickname) => set({ nickname }),

  setUser: ({ accessToken, role, nickname, email, profileUrl, uuid }) =>
    set((prev) => ({
      accessToken: accessToken ?? prev.accessToken,
      role: role ?? prev.role,
      nickname: nickname ?? prev.nickname,
      email: email ?? prev.email,
      profileUrl: profileUrl ?? prev.profileUrl,
      uuid: uuid ?? prev.uuid,
    })),

  clear: () =>
    set({
      accessToken: null,
      role: null,
      nickname: null,
      email: null,
      profileUrl: null,
      uuid: null,
    }),
}));
