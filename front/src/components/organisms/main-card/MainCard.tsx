'use client';

import Image from 'next/image';
import PromoBlockchain from '@/assets/images/promo-blockchain.png';
import PromoHouse from '@/assets/images/promo-house.png';
import PromoCharge from '@/assets/images/promo-charge.png';
import PromoReview from '@/assets/images/promo-review.png';
import { useLanguage } from '@/features/language';
import { messages } from './locale';

const promoBase = [
  { img: PromoBlockchain, bg: 'bg-blue-50' },
  // { img: PromoReview, bg: 'bg-yellow/20' },
  { img: PromoReview, bg: 'bg-blue-50' },
  { img: PromoHouse, bg: 'bg-blue-50' },
  // { img: PromoCharge, bg: 'bg-red/10' },
  { img: PromoCharge, bg: 'bg-blue-50' },
];

export default function MainCard() {
  const { lang } = useLanguage();

  return (
    <div className="flex flex-col gap-4 w-full mb-20">
      {promoBase.map((item, i) => {
        const text = messages[lang][i];
        return (
          <div
            key={i}
            className={`flex items-center justify-between rounded-md px-6 py-6 shadow-sm ${item.bg} w-full`}
          >
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-semibold text-gray-900 whitespace-pre-line">
                {text.title}
              </h3>
              <p className="mt-2 text-sm text-gray-500">{text.desc}</p>
            </div>
            <div className="flex-shrink-0 ml-4">
              <Image src={item.img} alt="Promo" width={64} height={64} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
