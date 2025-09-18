'use client';

import { useAuthStore } from '@/stores/useAuthStores';
import { GuestProfile } from '@/features/my-profile';
import { HostProfile } from '@/features/my-profile';

export default function MyProfilePage() {
  const role = useAuthStore((s) => s.role);
  console.log(role);

  if (role === 'host') {
    return <HostProfile />;
  }

  return <GuestProfile />;
}
