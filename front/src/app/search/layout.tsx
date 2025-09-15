'use client';

import BackHeader from '@/components/molecules/BackHeader';
import { useLanguage } from '@/features/language';

export default function LanguageLayout({ children }: { children: React.ReactNode }) {
  const { lang } = useLanguage();

  return (
    <>
      <BackHeader title={lang === 'kor' ? '검색' : 'Search'} />
      <section className="flex-1 flex items-center justify-center">{children}</section>
    </>
  );
}
