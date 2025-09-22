'use client';

import { useLanguage } from '@/features/language';
import { stayDetailLocale } from '@/features/stays/locale';
import { useRouter } from 'next/navigation';

interface Props {
  stay: {
    stayId: number;
  };
}

export default function StayHostBar({ stay }: Props) {
  const { lang } = useLanguage();
  const t = stayDetailLocale[lang];
  const router = useRouter();

  const handleEdit = () => {
    router.push(`/edit-stay/${encodeURIComponent(stay.stayId)}`);
  };

  return (
    <div className="fixed bottom-0 w-full max-w-[480px] bg-white border-t border-gray-200">
      <div className="mx-auto px-6 py-4 flex gap-3 mb-6">
        <button
          onClick={handleEdit}
          className="flex-1 bg-gray-600 text-white rounded-md px-4 py-3 text-base font-medium transition"
        >
          {t.common.edit}
        </button>
      </div>
    </div>
  );
}
