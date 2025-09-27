'use client';

import { useAuthStore } from '@/stores/useAuthStores';
import { GuestProfile, HostProfile } from '@/features/my-profile';

export default function MyProfilePage() {
  const role = useAuthStore((s) => s.role);

  return role === 'host' ? <HostProfile /> : <GuestProfile />;
}
