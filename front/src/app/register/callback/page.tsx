'use client';

import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/stores/useAuthStores';
import { useRegisterStore } from '@/features/register';
import { http } from '@/apis/httpClient';
import { Lottie } from '@/components/atoms/Lottie';

function CallbackInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
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
        const { needProfileUpdate, nickname, email, profileUrl, uuid, role } = res.data;
        if (accessToken) {
          setUser({ accessToken, nickname, email, profileUrl, uuid, role });
          useRegisterStore.getState().setNickname(nickname);
          useRegisterStore.getState().setEmail(email);
          useRegisterStore.getState().setProfileUrl(profileUrl);
          // const next = needProfileUpdate ? '/language' : '/main';
          const next = '/language';
          router.replace(next);
        } else {
          router.replace('/');
        }
      } catch (e) {
        router.replace('/');
      }
    };

    issueToken();
  }, [router, searchParams, setUser]);

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
