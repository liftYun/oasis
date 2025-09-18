'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Logo from '@/assets/logos/oasis-logo-512.png';
import { useAuthStore } from '@/stores/useAuthStores';

export function Header() {
  const router = useRouter();
  const { profileUrl, nickname } = useAuthStore();

  return (
    <header className="flex items-center justify-between px-2 py-4">
      <button onClick={() => router.push('/')} className="flex items-center gap-2 group">
        {/* <Image src={Logo} alt="Oasis Logo" width={36} height={36} className="rounded-lg" /> */}
        <span className="text-lg font-bold text-gray-700 group-hover:text-primary transition">
          oasis
        </span>
      </button>

      <button onClick={() => router.push('/my-profile/detail')} className="flex items-center gap-2">
        <Image
          src={profileUrl || '/default-profile.png'}
          alt="profile"
          width={36}
          height={36}
          className="rounded-full object-cover"
        />
        <span className="hidden sm:inline text-sm font-medium text-gray-600">{nickname}</span>
      </button>
    </header>
  );
}
