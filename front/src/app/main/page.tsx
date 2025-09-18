'use client';

import { GuestMain, HostMain } from '@/features/main';
import { useAuthStore } from '@/stores/useAuthStores';

export default function Page() {
  const role = useAuthStore((s) => s.role);
  console.log(role);

  if (role === 'host') {
    return <HostMain />;
  }

  return <GuestMain />;
}
