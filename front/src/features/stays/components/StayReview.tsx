'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { useLanguage } from '@/features/language';
import { stayDetailLocale } from '@/features/stays/locale';

interface StayReviewProps {
  rating: number;
  highReviews: string;
  lowReviews: string;
}

export default function StayReview({ rating, highReviews, lowReviews }: StayReviewProps) {
  const [tab, setTab] = useState<'high' | 'low'>('high');
  const { lang } = useLanguage();
  const t = stayDetailLocale[lang];

  const tabs = [
    { key: 'high', label: t.review.highSummary },
    { key: 'low', label: t.review.lowSummary },
  ] as const;

  return (
    <section className="mt-12">
      <h2 className="text-lg font-semibold mb-2">{t.review.avgTitle}</h2>
      <div className="flex items-center justify-between rounded-md mt-2 bg-gray-100 p-4">
        <div className="flex text-yellow gap-2">
          {Array.from({ length: 5 }).map((_, i) => {
            const full = i + 1 <= Math.floor(rating);
            const half = i + 1 === Math.ceil(rating) && rating % 1 >= 0.5;

            return (
              <div key={i} className="relative w-4 h-4">
                <Star className="text-white fill-white" size={18} />
                {full && (
                  <Star className="text-yellow fill-yellow absolute top-0 left-0" size={18} />
                )}
                {half && (
                  <div className="absolute top-0 left-0 w-1/2 overflow-hidden">
                    <Star className="text-yellow fill-yellow" size={18} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <span className="px-3 py-0.5 rounded-full bg-yellow/30 text-gray-600 font-medium">
          {rating.toFixed(1)}
        </span>
      </div>

      <h2 className="text-lg font-semibold mt-12 mb-2">{t.review.aiSummaryTitle}</h2>
      <div className="rounded-md mt-2 bg-blue-50 px-3 py-2 text-sm text-primary mb-4">
        <strong>TIP</strong> {t.review.tip}
      </div>

      <div className="relative w-full max-w-md mx-auto mb-4">
        <div className="flex relative bg-gray-100 rounded-md p-2">
          {tabs.map((tabItem) => (
            <button
              key={tabItem.key}
              onClick={() => setTab(tabItem.key)}
              className={`flex-1 py-2 text-sm font-medium relative z-10 transition-colors ${
                tab === tabItem.key ? 'text-gray-600' : 'text-gray-400'
              }`}
            >
              {tabItem.label}
            </button>
          ))}

          <motion.div
            className="absolute top-1.5 bottom-1.5 w-[calc(50%-10px)] rounded-md bg-white shadow"
            layout
            animate={{ x: tab === 'high' ? '0%' : '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          />
        </div>
      </div>

      <ul className="space-y-2 text-gray-600 text-sm bg-gray-100 rounded-md p-4">
        {tab === 'high' ? highReviews : lowReviews}
      </ul>

      <button className="mt-3 w-full rounded-md bg-gray-100 py-3 text-sm text-gray-600 hover:bg-gray-200">
        {t.review.seeAll}
      </button>
    </section>
  );
}
