'use client';

import { useEffect, useState } from 'react';
import { Lang } from '@/types';
import { useLanguage } from '@/features/language';
import { fetchRegions } from '@/services/stay.api';
import { RegionDto } from '@/services/stay.types';

interface Props {
  selectedCity: string | null;
  onSelectCity: (city: string) => void;
  selectedRegion: string | null;
  onSelectRegion: (regionName: string, regionId: number) => void;
}

export function SearchSelector({
  selectedCity,
  onSelectCity,
  selectedRegion,
  onSelectRegion,
}: Props) {
  const { lang } = useLanguage();
  const [tab, setTab] = useState<'city' | 'region'>('city');
  const [regions, setRegions] = useState<RegionDto[]>([]);

  const city = regions.find((r) => r.region === selectedCity);

  const tabLabels: Record<Lang, { city: string; region: string }> = {
    kor: { city: '도시', region: '지역' },
    eng: { city: 'City', region: 'Region' },
  };

  useEffect(() => {
    const loadRegions = async () => {
      try {
        const data = await fetchRegions();
        setRegions(data.result ?? []);
      } catch (e) {
        console.error(e);
      }
    };
    loadRegions();
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-[0_0_10px_rgba(0,0,0,0.1)] p-6 my-10 flex flex-col">
      <div className="flex gap-3 justify-center mb-6">
        <button
          onClick={() => setTab('city')}
          className={`px-5 py-2 text-sm rounded-full transition-all duration-200 font-medium
            ${
              tab === 'city'
                ? 'bg-primary text-white shadow-sm ring-1 ring-primary'
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
        >
          {tabLabels[lang].city}
        </button>

        <button
          onClick={() => setTab('region')}
          disabled={!selectedCity}
          className={`px-5 py-2 text-sm rounded-full transition-all duration-200 font-medium
            ${
              tab === 'region'
                ? 'bg-primary text-white shadow-sm ring-1 ring-primary'
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            } ${!selectedCity ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {tabLabels[lang].region}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pr-1 pt-1">
        {tab === 'city' && (
          <div className="flex flex-wrap gap-3 text-sm">
            {regions.map((r) => (
              <button
                key={r.region}
                onClick={() => {
                  onSelectCity(r.region);
                  setTab('region');
                }}
                className={`px-4 py-2 rounded-full border transition-all duration-200
          ${
            selectedCity === r.region
              ? 'bg-primary/10 text-primary border-primary'
              : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
          }`}
              >
                {r.region}
              </button>
            ))}
          </div>
        )}

        {tab === 'region' && selectedCity && (
          <div className="flex flex-wrap gap-3 text-sm">
            {city?.subRegions.map((sr) => (
              <button
                key={sr.id}
                onClick={() => onSelectRegion(sr.subName, sr.id)}
                className={`px-4 py-2 rounded-full border transition-all duration-200
          ${
            selectedRegion === sr.subName
              ? 'bg-primary/10 text-primary border-primary'
              : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
          }`}
              >
                {sr.subName}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
