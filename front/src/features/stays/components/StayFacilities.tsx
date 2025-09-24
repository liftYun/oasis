'use client';

import { useLanguage } from '@/features/language';
import { stayDetailLocale } from '@/features/stays/locale';
import { useState } from 'react';
import { facilityMap, facilityLocale } from '@/features/stays/facilityLocale';

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

export function StayFacilities({ facilities }: StayFacilitiesProps) {
  const { lang } = useLanguage();
  const t = stayDetailLocale[lang];

  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <section className="mt-12">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <span className="inline-block w-1.5 h-5 bg-primary rounded-sm" />
        {t.detail.facilitiesTitle}
      </h2>

      <div className="overflow-x-auto no-scrollbar">
        <div className="flex gap-3 flex-nowrap">
          {facilities.map((cat, i) => (
            <button
              key={i}
              onClick={() => setSelectedIndex(i)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border shrink-0 transition
          ${
            selectedIndex === i
              ? 'bg-primary text-white border-primary'
              : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-100'
          }`}
            >
              {t.facilities[cat.category as keyof typeof t.facilities] ?? cat.category}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mt-4">
        {(facilities[selectedIndex]?.facilities ?? []).map((f) => {
          const key = facilityMap[f.id];
          const display = key ? facilityLocale[key][lang] : f.name;
          return (
            <span
              key={f.id}
              className="px-4 py-2 rounded-md border border-gray-200 bg-white
                         text-gray-600 text-sm select-none"
            >
              {display}
            </span>
          );
        })}
      </div>
    </section>
  );
}
