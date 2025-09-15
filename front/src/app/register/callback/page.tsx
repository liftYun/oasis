'use client';

import { Suspense, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/useAuthStores';
import { useRegisterStore } from '@/features/register';
import { http } from '@/apis/httpClient';
import { Lottie } from '@/components/atoms/Lottie';

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
          setUser({ accessToken, nickname });
          useRegisterStore.getState().setNickname(nickname);
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
  return (
    <div className="flex flex-col items-center justify-center py-10">
      <Lottie src="/lotties/spinner.json" className="w-20 h-20" />
      <p className="text-sm text-gray-500 mt-2">로그인 처리 중...</p>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center py-10">
          <Lottie src="/lotties/spinner.json" className="w-20 h-20" />
          <p className="text-sm text-gray-500 mt-2">로딩 중...</p>
        </div>
      }
    >
      <CallbackInner />
    </Suspense>
  );
}
