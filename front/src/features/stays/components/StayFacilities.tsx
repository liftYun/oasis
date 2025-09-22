'use client';

import { useLanguage } from '@/features/language';
import { stayDetailLocale } from '@/features/stays/locale';

interface Facility {
  id: number;
  name: string;
}

interface FacilityCategory {
  category: string;
  facilities: Facility[];
}

interface StayFacilitiesProps {
  facilities: FacilityCategory[];
}

export default function StayFacilities({ facilities }: StayFacilitiesProps) {
  const { lang } = useLanguage();
  const t = stayDetailLocale[lang];

  return (
    <section className="mt-8">
      <h2 className="text-lg font-semibold mb-4">{t.detail.facilitiesTitle}</h2>

      <div className="flex gap-4 mt-2 flex-wrap">
        {facilities.map((cat, i) => (
          <button
            key={i}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition
              ${
                i === 0
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-100'
              }`}
          >
            {t.facilities[cat.category as keyof typeof t.facilities]}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-4 mt-4">
        {(facilities[0]?.facilities ?? []).map((f) => (
          <span
            key={f.id}
            className="px-4 py-2 rounded-md border border-gray-200 bg-white 
                       text-gray-600 text-sm hover:bg-gray-100 select-none"
          >
            {f.name}
          </span>
        ))}
      </div>
    </section>
  );
}
