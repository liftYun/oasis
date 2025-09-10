'use client';

import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';

interface Props {
  title?: string;
}

export default function BackHeader({ title = '검색' }: Props) {
  const router = useRouter();

  return (
    <header className="flex items-center justify-between pb-6 px-2">
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
