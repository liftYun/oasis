'use client';

import { useState, useEffect, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';

import PromoBlockchain from '@/assets/images/promo-blockchain.png';
import PromoHouse from '@/assets/images/promo-house.png';
import PromoCharge from '@/assets/images/promo-charge.png';
import PromoReview from '@/assets/images/promo-review.png';

import { useLanguage } from '@/features/language';
import { messages } from './locale';

const promoBase = [
  { img: PromoBlockchain, bg: 'bg-blue-50' },
  { img: PromoReview, bg: 'bg-yellow/20' },
  { img: PromoHouse, bg: 'bg-blue-50' },
  { img: PromoCharge, bg: 'bg-red/10' },
];

export default function PromoCarousel() {
  const { lang } = useLanguage();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIndex((p) => (p + 1) % promoBase.length), 3000);
    return () => clearInterval(id);
  }, []);

  const slides = useMemo(() => {
    return promoBase.map((b, i) => {
      const text = messages[lang][i];
      return {
        ...b,
        title: text.title,
        desc: text.desc,
      };
    });
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
            transition={{ duration: 0.5 }}
            className={`absolute inset-0 flex items-center justify-between rounded-xl px-6 py-6 shadow-sm ${current.bg}`}
          >
            <div>
              <h3 className="text-base font-semibold text-gray-900 whitespace-pre-line">
                {current.title}
              </h3>
              <p className="mt-2 text-sm text-gray-500">{current.desc}</p>
            </div>
            <div className="flex-shrink-0">
              <Image src={current.img} alt="Promo" width={80} height={80} />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-3 flex items-center justify-center gap-1.5">
        {slides.map((_, i) => (
          <button
            key={i}
            aria-label={`slide ${i + 1}`}
            onClick={() => setIndex(i)}
            className={`h-1.5 rounded-full transition-all ${
              i === index ? 'w-4 bg-gray-600' : 'w-1.5 bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
