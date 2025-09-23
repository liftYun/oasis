'use client';

import Image from 'next/image';
// import Logo from '@/assets/logos/oasis-loading-logo.png';
import Logo from '@/assets/logos/oasis-logo-512.png';

export function SplashLoading() {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white">
      <Image src={Logo} alt="Oasis Logo" width={120} height={120} priority />
      <span className="pt-2 font-extrabold text-5xl  bg-gradient-to-r from-primary to-green bg-clip-text text-transparent">
        oasis
      </span>

      <p className="absolute bottom-16 text-sm text-gray-400">© SSAFY E103 무한도전</p>
    </div>
  );
}
