'use client';

import { useEffect, useState } from 'react';
import { Lang } from '@/types';
import { cityLabels, regionLabels } from '@/features/search';

function normalizeLang(v: unknown): Lang {
  return v === 'eng' ? 'eng' : 'kor';
}

interface Props {
  selectedCity: string | null;
  onSelectCity: (city: string) => void;
  selectedRegion: string | null;
  onSelectRegion: (region: string) => void;
}

export function SearchSelector({
  selectedCity,
  onSelectCity,
  selectedRegion,
  onSelectRegion,
}: Props) {
  const [lang, setLang] = useState<Lang>('kor');
  const [tab, setTab] = useState<'city' | 'region'>('city');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const raw = localStorage.getItem('app_lang');
      setLang(normalizeLang(raw));
    }
  }, []);

  const tabLabels: Record<Lang, { city: string; region: string }> = {
    kor: { city: '도시', region: '지역' },
    eng: { city: 'City', region: 'Region' },
  };

  const currentRegions =
    selectedCity && regionLabels[lang][selectedCity] ? regionLabels[lang][selectedCity] : [];

  return (
    <div className="bg-white rounded-xl shadow-[0_0_10px_rgba(0,0,0,0.1)] p-6 mt-10">
      <div className="flex gap-4 mt-2 mb-6 ml-4">
        <button
          onClick={() => setTab('city')}
          className={`px-4 py-1.5 text-sm rounded-full ${
            tab === 'city' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500'
          }`}
        >
          {tabLabels[lang].city}
        </button>
        <button
          onClick={() => setTab('region')}
          disabled={!selectedCity}
          className={`px-4 py-1.5 text-sm rounded-full ${
            tab === 'region' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500'
          } ${!selectedCity ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {tabLabels[lang].region}
        </button>
      </div>

      {tab === 'city' && (
        <div className="grid grid-cols-3 gap-8 text-sm mb-6">
          {cityLabels[lang].map((city) => (
            <button
              key={city}
              onClick={() => onSelectCity(city)}
              className={`${
                selectedCity === city ? 'text-primary font-semibold' : 'text-gray-400'
              }`}
            >
              {city}
            </button>
          ))}
        </div>
      )}

      {tab === 'region' && selectedCity && (
        <div className="grid grid-cols-3 gap-6 text-sm mb-6">
          {currentRegions.map((region) => (
            <button
              key={region}
              onClick={() => onSelectRegion(region)}
              className={`${
                selectedRegion === region ? 'text-primary font-semibold' : 'text-gray-400'
              }`}
            >
              {region}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
