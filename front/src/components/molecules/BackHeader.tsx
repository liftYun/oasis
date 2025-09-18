'use client';

import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';

interface BackHeaderContentProps {
  title?: string;
  className?: string;
  onBack?: () => void;
}

export function BackHeaderContent({ title = '검색', className, onBack }: BackHeaderContentProps) {
  const router = useRouter();

  return (
    <header className={`h-14 bg-white px-2 flex items-center justify-between ${className || ''}`}>
      <button
        onClick={() => (onBack ? onBack() : router.back())}
        className="p-2 rounded-full hover:bg-gray-100 active:bg-gray-200"
        aria-label="back"
      >
        <ChevronLeft className="w-7 h-7 text-gray-500" />
      </button>

      <h1 className="absolute left-1/2 -translate-x-1/2 text-base font-semibold text-gray-600">
        {title}
      </h1>

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
  onBack?: () => void;
}

export default function BackHeader({ title = '검색', onBack }: Props) {
  return (
    <FixedHeaderLayout>
      <BackHeaderContent title={title} onBack={onBack} />
    </FixedHeaderLayout>
  );
}
