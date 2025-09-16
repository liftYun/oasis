'use client';

import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';

interface BackHeaderContentProps {
  title?: string;
  className?: string;
}

export function BackHeaderContent({ title = '검색', className }: BackHeaderContentProps) {
  const router = useRouter();

  return (
    <header className={`h-14 bg-white px-2 flex items-center justify-between ${className || ''}`}>
      <button
        onClick={() => router.back()}
        className="p-2 rounded-full hover:bg-gray-100 active:bg-gray-200"
        aria-label="back"
      >
        <ChevronLeft className="w-7 h-7 text-gray-500" />
      </button>

      <h1 className="flex-1 text-center text-base font-semibold text-gray-600 -ml-8">{title}</h1>

      <div className="w-7" />
    </header>
  );
}

function FixedHeaderLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed left-1/2 -translate-x-1/2 top-[env(safe-area-inset-top)] w-full max-w-[480px] z-40">
      {children}
    </div>
  );
}

interface Props {
  title?: string;
}

export default function BackHeader({ title = '검색' }: Props) {
  return (
    <FixedHeaderLayout>
      <BackHeaderContent title={title} />
    </FixedHeaderLayout>
  );
}
