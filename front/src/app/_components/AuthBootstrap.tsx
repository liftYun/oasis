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
    // console.log('AuthBootstrap mounted');
    // console.log('Current pathname:', pathname);
    // console.log('initialized:', initialized);

    const skipPaths = ['/splash', '/register'];
    if (pathname === '/' || skipPaths.some((p) => pathname.startsWith(p))) {
      // console.log('Skipping auth refresh on this path');
      return;
    }

    (async () => {
      if (initialized) {
        // console.log('Already initialized — skipping refresh');
        return;
      }

      try {
        // console.log('Trying refresh token...');
        const res = await http.rawPost('/api/v1/auth/refresh', null, {
          withCredentials: true,
        });

        // console.log('Refresh response:', res);

        const authHeader = res.headers?.['authorization'];
        // console.log('Authorization header from refresh:', authHeader);

        const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : undefined;

        if (!token) {
          // console.warn('No token returned from refresh');
        } else {
          // console.log('Got new access token:', token);
          setAccessToken(token);

          // console.log('Fetching user info...');
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

          // console.log('User info response:', me);

          const r = me.result;
          setUser({
            accessToken: token,
            email: r.email,
            nickname: r.nickname,
            profileUrl: r.profileUrl,
            role: r.role === 'ROLE_HOST' ? 'host' : 'guest',
            uuid: r.uuid,
          });
          // console.log('User set in store');
        }
      } catch (err) {
        // console.error('Refresh or user fetch failed:', err);
      } finally {
        setInitialized(true);
        // console.log('AuthBootstrap initialization complete');
      }
    })();
  }, [initialized, pathname, setAccessToken, setInitialized, setUser]);

  return null;
}
