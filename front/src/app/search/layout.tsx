'use client';

import { useEffect, useState } from 'react';
import BackHeader from '@/components/molecules/BackHeader';
import { Lang } from '@/types';

function normalizeLang(v: unknown): Lang {
  return v === 'eng' ? 'eng' : 'kor';
}

export default function LanguageLayout({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>('kor');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const raw = localStorage.getItem('app_lang');
      setLang(normalizeLang(raw));
    }
  }, []);

  return (
    <>
      <BackHeader title={lang === 'kor' ? '검색' : 'Search'} />
      <section className="flex-1 flex items-center justify-center">{children}</section>
    </>
  );
}
