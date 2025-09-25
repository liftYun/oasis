'use client';

import { useRouter } from 'next/navigation';
import { useLanguage } from '@/features/language';
import { messages } from '@/features/smart-key';
import { Lottie } from '@/components/atoms/Lottie';

export function SmartKeyEmpty() {
  const { lang } = useLanguage();
  const t = messages[lang] ?? messages.kor;
  const router = useRouter();

  const handleReserve = () => {
    router.push('/search');
  };

  return (
    <>
      <main className="flex flex-col w-full pt-10 pb-28 min-h-screen bg-white">
        <h2 className="text-2xl font-semibold text-left mb-6">{t.title}</h2>
        <div className="flex flex-col w-full bg-white items-center justify-center">
          <div className="w-full rounded-xl bg-blue-50 p-6 mb-6 text-gray-600">
            <p className="text-base font-semibold mb-1">{t.descriptionTitle}</p>
            <p className="text-sm leading-relaxed">{t.description}</p>
          </div>
          <div className="w-full rounded-2xl p-8 pt-10 flex flex-col items-center bg-gray-100">
            <div className="text-center mb-8">
              <h3 className="text-lg font-bold text-gray-600">{t.empty.title}</h3>
              <p className="mt-2 text-sm text-gray-500">{t.empty.sub}</p>
            </div>

            <div className="w-[240px] h-[240px] flex items-center justify-center my-8 mb-12">
              <Lottie src="/lotties/card.json" className="w-full h-full" />
            </div>

            <button
              onClick={handleReserve}
              className="w-full py-3 rounded-md bg-primary text-white text-sm font-medium shadow-sm hover:opacity-90 transition"
            >
              {t.button}
            </button>
          </div>

          <div className="flex justify-center mb-6 animate-bounce">
            <p className="relative inline-flex flex-col items-center justify-center text-sm px-6 py-2 bg-gray-600 text-white rounded-md">
              <span>{t.tooltip.main}</span>
              <span className="text-xs text-gray-300">{t.tooltip.sub}</span>

              <span className="absolute left-1/2 -top-[4px] w-3 h-3 bg-gray-600 rotate-45 -translate-x-1/2"></span>
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
