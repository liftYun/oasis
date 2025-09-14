'use client';

import Image from 'next/image';
import Logo from '@/assets/logos/oasis-loading-logo.png';

export function SplashLoading() {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white">
      <Image src={Logo} alt="Oasis Logo" width={120} height={120} priority />

      <p className="absolute bottom-16 text-sm text-gray-400">© SSAFY E103 무한도전</p>
    </div>
  );
}
