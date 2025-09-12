'use client';

import { startGoogleLogin } from '@/services/auth.api';

export function useGoogleLogin() {
  return () => {
    try {
      startGoogleLogin();
    } catch (e) {
      console.error(e);
      alert('구글 로그인 중 문제가 발생했습니다.');
    }
  };
}
