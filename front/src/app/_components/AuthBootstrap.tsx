'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { http } from '@/apis/httpClient';
import { useAuthStore } from '@/stores/useAuthStores';

type RoleWire = 'ROLE_GUEST' | 'ROLE_HOST';

export default function AuthBootstrap() {
  const pathname = usePathname();
  const router = useRouter();
  const accessToken = useAuthStore((s) => s.accessToken);
  const initialized = useAuthStore((s) => s.initialized);
  const setAccessToken = useAuthStore((s) => s.setAccessToken);
  const setUser = useAuthStore((s) => s.setUser);
  const setInitialized = useAuthStore((s) => s.setInitialized);
  const clear = useAuthStore((s) => s.clear);

  useEffect(() => {
    const skipPaths = ['/', '/splash', '/register'];
    if (!pathname || skipPaths.some((p) => pathname.startsWith(p))) return;

    if (initialized || accessToken) return;

    (async () => {
      try {
        const res = await http.rawPost('/api/v1/auth/refresh', null, { withCredentials: true });
        const authHeader = res.headers?.['authorization'];
        const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : undefined;

        if (!token) {
          console.warn('No token returned from refresh');
          clear();
          return;
        }

        setAccessToken(token);

        const me = await http.get<{
          result: {
            email: string;
            nickname: string;
            profileUrl?: string;
            role: RoleWire;
            language: string;
            uuid?: string;
          };
        }>('/api/v1/user/mypage');

        const r = me.result;
        setUser({
          accessToken: token,
          email: r.email,
          nickname: r.nickname,
          profileUrl: r.profileUrl,
          role: r.role === 'ROLE_HOST' ? 'host' : 'guest',
          uuid: r.uuid,
        });
      } catch (err: any) {
        console.error('AuthBootstrap: refresh or user fetch failed:', err?.message);
        clear();
      } finally {
        setInitialized(true);
      }
    })();
  }, [initialized, accessToken, pathname, router, setAccessToken, setInitialized, setUser, clear]);

  return null;
}
