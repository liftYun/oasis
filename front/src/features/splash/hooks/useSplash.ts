'use client';

import { messages } from '@/features/splash/locale';
import { useGoogleLogin } from '@/features/splash/hooks/useGoogleLogin';

export function useSplash(lang: 'ko' | 'en') {
  const t = messages[lang];
  const googleLogin = useGoogleLogin();

  const slides = t.slides;

  const handleGoogleLogin = async () => {
    await googleLogin();
  };

  return { t, slides, handleGoogleLogin };
}
