'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/stores/useAuthStores';
import { handleLoginCallback } from '@/services/auth.api';

export default function AuthCallbackPage() {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);

  useEffect(() => {
    (async () => {
      try {
        const { accessToken, needProfileUpdate } = await handleLoginCallback();

        if (accessToken) {
          setUser({ accessToken });
        }

        if (needProfileUpdate) {
          router.replace('/register');
        } else {
          router.replace('/');
        }
      } catch (err) {
        toast.error('구글 로그인에 실패했어요 😢');
      }
    })();
  }, []);
}
