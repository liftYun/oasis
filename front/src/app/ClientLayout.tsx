'use client';

import { useEffect, useState } from 'react';
import { SplashLoading } from '@/components/atoms/SplashLoading';

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setHydrated(true));
    return () => cancelAnimationFrame(id);
  }, []);

  if (!hydrated) return <SplashLoading />;

  return <>{children}</>;
}
