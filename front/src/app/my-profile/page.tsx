'use client';

import { useAuthStore } from '@/stores/useAuthStores';
import { GuestProfile } from '@/features/my-profile';
import { HostProfile } from '@/features/my-profile';

export default function MyProfilePage() {
  //   const { role } = useAuthStore();

  //   if (!role) {
  //     return (
  //       <div className="flex items-center justify-center min-h-screen">
  //         <p className="text-gray-500">로그인 후 이용할 수 있어요.</p>
  //       </div>
  //     );
  //   }

  //   return role === 'guest' ? <GuestProfile /> : <HostProfile />;

  return <GuestProfile />;
  // return <HostProfile />;
}
