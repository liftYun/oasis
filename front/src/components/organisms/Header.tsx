'use client';

import Image from 'next/image';
import Logo from '@/assets/logos/oasis-logo-512.png';
import DefaultAvatar from '@/assets/icons/preview-user.png';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/useAuthStores';

export const Header = () => {
  const router = useRouter();
  const { nickname, profileUrl } = useAuthStore();

  return (
    <header className="w-full bg-white0">
      <div className="flex items-center justify-between h-14 px-6">
        <button
          onClick={() => router.push('/main')}
          className="flex items-center gap-2 cursor-pointer"
        >
          <Image src={Logo} alt="Oasis Logo" width={30} height={30} />
          <span className="font-semibold text-lg tracking-tight bg-gradient-to-r from-primary to-green bg-clip-text text-transparent">
            oasis
          </span>
        </button>

        <button
          onClick={() => router.push('/my-profile')}
          className="w-8 h-8 rounded-full overflow-hidden border border-gray-200 hover:ring-2 hover:ring-primary transition"
        >
          <Image
            src={profileUrl || DefaultAvatar}
            alt={nickname || 'User Profile'}
            width={32}
            height={32}
            className="object-cover"
          />
        </button>
      </div>
    </header>
  );
};
