'use client';

import { Suspense, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/useAuthStores';

function CallbackInner() {
  const params = useSearchParams();
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);

  useEffect(() => {
    const accessToken = params.get('accessToken');
    const needProfileUpdate = params.get('needProfileUpdate') === 'true';
    console.log('Auth Callback - accessToken:', accessToken);

    if (accessToken) {
      localStorage.setItem('accessToken', accessToken);
      setUser({ accessToken });
      router.replace(needProfileUpdate ? '/register' : '/');
    } else {
      router.replace('/');
    }
  }, [params, router, setUser]);

  return <p>로그인 처리 중...</p>;
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<p>로딩 중...</p>}>
      <CallbackInner />
    </Suspense>
  );
}
