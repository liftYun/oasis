// src/components/organisms/StayHeader.tsx
'use client';

import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';

export const StayHeader = ({ title }: { title: string }) => {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-100">
      <div className="relative flex items-center h-14 px-2 border-x border-gray-100">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-full hover:bg-gray-100 active:bg-gray-200 transition"
          aria-label="뒤로가기"
        >
          <ChevronLeft className="w-7 h-7 text-gray-600" />
        </button>

        <h1 className="absolute left-1/2 -translate-x-1/2 text-base font-semibold text-gray-600 truncate max-w-[70%] text-center">
          {title}
        </h1>

        <div className="w-7" />
      </div>
    </header>
  );
};
