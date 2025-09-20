'use client';

import { useLanguage } from '@/features/language';
import { stayDetailLocale } from '@/features/stays/locale';
import { useRouter } from 'next/navigation';

interface Props {
  price: number;
}

export default function StayBookingBar({ price }: Props) {
  const { lang } = useLanguage();
  const t = stayDetailLocale[lang];
  const router = useRouter();

  return (
    <div className="fixed bottom-0 w-full max-w-[480px] bg-white">
      <div className="mx-auto px-6 py-4 flex gap-3 mb-6">
        <div className="flex-1 bg-gray-100 rounded-md px-4 py-3 text-base font-semibold text-gray-600 flex items-center justify-center">
          $ {price.toLocaleString()} / {t.booking.perNight}
        </div>

        <button
          onClick={() => router.push('/reservation')}
          className="flex-1 bg-gray-600 text-white rounded-md px-4 py-3 text-base font-medium hover:bg-gray-600 transition"
        >
          {t.booking.reserve}
        </button>
      </div>
    </div>
  );
}
