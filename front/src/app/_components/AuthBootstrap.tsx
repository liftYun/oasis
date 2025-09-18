'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { http } from '@/apis/httpClient';
import { useAuthStore } from '@/stores/useAuthStores';

type RoleWire = 'ROLE_GUEST' | 'ROLE_HOST';

export default function AuthBootstrap() {
  const pathname = usePathname();
  const setAccessToken = useAuthStore((s) => s.setAccessToken);
  const setUser = useAuthStore((s) => s.setUser);
  const initialized = useAuthStore((s) => s.initialized);
  const setInitialized = useAuthStore((s) => s.setInitialized);

  useEffect(() => {
    const skipPaths = ['/', '/splash', '/register'];
    if (skipPaths.some((p) => pathname.startsWith(p))) return;

    (async () => {
      if (initialized) return;

      try {
        const res = await http.rawPost('/api/v1/auth/refresh', null, {
          withCredentials: true,
        });

        const authHeader = res.headers['authorization'];
        const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : undefined;

        if (token) {
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
        }
      } catch {
      } finally {
        setInitialized(true);
      }
    })();
  }, [initialized, pathname, setAccessToken, setInitialized, setUser]);

  return null;
}
