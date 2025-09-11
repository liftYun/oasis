'use client';

import Image from 'next/image';
import { useLanguage } from '@/features/language';
import { messages } from '@/features/smart-key';
import Card from '@/assets/images/card.png';

export function SmartKeyEmpty() {
  const { lang } = useLanguage();
  const t = messages[lang] ?? messages.kor;

  return (
    <main className="flex flex-col w-full px-6 py-10 min-h-screen bg-white">
      <h2 className="text-2xl font-semibold text-left mb-6">{t.title}</h2>

      <div className="w-full rounded-xl bg-gray-50 p-6 mb-6 text-gray-600 shadow-sm">
        <p className="text-base font-semibold mb-1">{t.descriptionTitle}</p>
        <p className="text-sm leading-relaxed">{t.description}</p>
      </div>

      <div className="w-full rounded-2xl p-8 flex flex-col items-center bg-gray-50">
        <p className="mb-8 text-gray-600 font-medium text-base whitespace-pre-line text-left w-full leading-snug">
          {t.guide}
        </p>

        <div className="relative w-[240px] h-[160px] mb-8">
          <Image src={Card} alt="card" fill className="object-contain drop-shadow-md" />
        </div>

        <button className="w-full py-3 rounded-md bg-primary text-white text-sm font-medium shadow-sm hover:opacity-90 transition">
          {t.button}
        </button>
      </div>
    </main>
  );
}
