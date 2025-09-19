'use client';

import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useLanguage } from '@/features/language';
import { reservationMessages } from '@/features/reservation/locale';

export default function ReservationPromo() {
  const { lang } = useLanguage();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIndex((p) => (p + 1) % 2), 3000);
    return () => clearInterval(id);
  }, []);

  const slides = useMemo(() => {
    const t = reservationMessages[lang].step2.promo;
    return [
      { bg: 'bg-blue-50', dot: 'bg-gray-400', title: t[0].title, caption: t[0].caption },
      { bg: 'bg-green/20', dot: 'bg-gray-400', title: t[1].title, caption: t[1].caption },
    ];
  }, [lang]);

  const current = slides[index];

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="relative h-32 overflow-hidden flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${lang}-${index}`}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.4 }}
            className={`absolute inset-0 flex items-center justify-between rounded-xl px-6 py-6 shadow-sm ${current.bg}`}
          >
            <div className="flex-1 pr-4">
              <h3 className="text-base font-semibold text-gray-900 whitespace-pre-line break-keep">
                {current.title}
              </h3>
              <p className="mt-2 text-xs text-gray-500">{current.caption}</p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-3 flex items-center justify-center gap-1.5">
        {slides.map((s, i) => (
          <button
            key={i}
            aria-label={`slide ${i + 1}`}
            onClick={() => setIndex(i)}
            className={`h-1.5 rounded-full transition-all ${
              i === index ? `w-4 ${s.dot}` : 'w-1.5 bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
