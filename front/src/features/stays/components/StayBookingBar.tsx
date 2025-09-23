'use client';

import { useLanguage } from '@/features/language';
import { stayDetailLocale } from '@/features/stays/locale';
import { useRouter } from 'next/navigation';
import { useReservationStore } from '@/stores/useResversionStores';

interface Props {
  stay: {
    stayId: number;
    title: string;
    titleEng?: string;
    price: number;
  };
}

export default function StayBookingBar({ stay }: Props) {
  const { lang } = useLanguage();
  const t = stayDetailLocale[lang];
  const router = useRouter();

  const setField = useReservationStore((state) => state.setField);

  const handleReserve = () => {
    setField('stayId', stay.stayId);
    setField('payment', stay.price);
    setField('stayTitle', stay.title);
    // setField('stayTitleEng', stay.titleEng);

    router.push('/reservation');
  };

  return (
    <div className="fixed bottom-0 w-full max-w-[480px] bg-white border border-gray-100">
      <div className="mx-auto px-6 py-4 flex gap-3 mb-6">
        <div className="flex-1 bg-gray-100 rounded-md px-4 py-3 text-base font-semibold text-gray-600 flex items-center justify-center">
          $ {stay.price.toLocaleString()} / {t.booking.perNight}
        </div>

        <button
          onClick={handleReserve}
          className="flex-1 bg-gray-600 text-white rounded-md px-4 py-3 text-base font-medium transition"
        >
          {t.booking.reserve}
        </button>
      </div>
    </div>
  );
}
