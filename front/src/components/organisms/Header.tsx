'use client';

import Image from 'next/image';
import Logo from '@/assets/logos/oasis-logo-512.png';
import { useRouter } from 'next/navigation';
import { Bell } from 'lucide-react';

export const Header = () => {
  const router = useRouter();

  return (
    <header className="w-full bg-white border-b border-gray-100">
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

        <button className="p-2 rounded-md hover:bg-gray-100 transition">
          <Bell size={20} className="text-gray-600" />
        </button>
      </div>
    </header>
  );
};
