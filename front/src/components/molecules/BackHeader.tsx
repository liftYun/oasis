'use client';

import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';

interface Props {
  title?: string;
}

export default function BackHeader({ title = '검색' }: Props) {
  const router = useRouter();

  return (
    <header className="fixed left-1/2 -translate-x-1/2 top-[env(safe-area-inset-top)] w-full max-w-[480px] h-14 z-50 bg-white px-2 flex items-center justify-between">
      <button
        onClick={() => router.back()}
        className="p-2 rounded-full hover:bg-gray-100 active:bg-gray-200"
        aria-label="back"
      >
        <ChevronLeft className="w-8 h-8 text-gray-500" />
      </button>

      <h1 className="flex-1 text-center text-base font-semibold text-gray-600 -ml-8">{title}</h1>

      <div className="w-7" />
    </header>
  );
}
