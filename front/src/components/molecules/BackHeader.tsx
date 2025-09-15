'use client';

import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';

interface BackHeaderContentProps {
  title?: string;
  className?: string;
}

// 순수 UI 컴포넌트 (레이아웃 책임 없음)
export function BackHeaderContent({ title = '검색', className }: BackHeaderContentProps) {
  const router = useRouter();

  return (
    <header className={`h-14 bg-white px-2 flex items-center justify-between ${className || ''}`}>
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

// 레이아웃 래퍼 컴포넌트
function FixedHeaderLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed left-1/2 -translate-x-1/2 top-[env(safe-area-inset-top)] w-full max-w-[480px] z-50">
      {children}
    </div>
  );
}

// 기존 API 호환성을 위한 래핑된 컴포넌트 (기존 import 경로 유지)
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
