'use client';

import { Suspense, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/useAuthStores';
import { http } from '@/apis/httpClient';

function CallbackInner() {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);

  useEffect(() => {
    const issueToken = async () => {
      try {
        const res = await http.rawPost('/api/v1/auth/issue', null, {
          withCredentials: true,
        });

        const authHeader = res.headers['authorization'];
        const accessToken = authHeader?.startsWith('Bearer ')
          ? authHeader.split(' ')[1]
          : undefined;

        const { needProfileUpdate, nextUrl, nickname } = res.data;

        if (accessToken) {
          // localStorage.setItem('accessToken', accessToken);
          setUser({ accessToken, nickname });
          router.replace(needProfileUpdate ? '/register' : nextUrl);
        } else {
          router.replace('/');
        }
      } catch (e) {
        router.replace('/');
      }
    };

    issueToken();
  }, [router, setUser]);

  return <p>로그인 처리 중...</p>;
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<p>로딩 중...</p>}>
      <CallbackInner />
    </Suspense>
  );
}
