'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function LanguagePage() {
  const [lang, setLang] = useState<'ko' | 'en'>('ko');

  useEffect(() => {
    const stored = localStorage.getItem('lang');
    if (stored === 'en' || stored === 'ko') {
      setLang(stored);
    }
  }, []);

  return (
    <main className="w-full max-w-sm mx-auto px-6 py-10">
      <h1 className="text-xl font-bold">
        {lang === 'ko' ? '사용 언어를 선택해주세요.' : 'Please select a language.'}
        <br />
        <span className="text-gray-500 text-base">
          {lang === 'ko' ? 'Please select a language.' : '언어를 선택해주세요.'}
        </span>
      </h1>

      <div className="mt-8 flex flex-col gap-4">
        <Link
          href="/splash"
          className={`block rounded-2xl p-5 transition ${
            lang === 'ko' ? 'bg-black text-white hover:opacity-90' : 'bg-gray-200 hover:bg-gray-300'
          }`}
          prefetch
        >
          <div className="text-lg font-semibold">한국어</div>
          <div className="text-sm opacity-80 mt-1">한국어로 서비스 이용하기</div>
        </Link>

        <Link
          href="/splash"
          className={`block rounded-2xl p-5 transition ${
            lang === 'en' ? 'bg-black text-white hover:opacity-90' : 'bg-gray-200 hover:bg-gray-300'
          }`}
          prefetch
        >
          <div className="text-lg font-semibold">English</div>
          <div className="text-sm opacity-80 mt-1">Use the service in English</div>
        </Link>
      </div>
    </main>
  );
}
