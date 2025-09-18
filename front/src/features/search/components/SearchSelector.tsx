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

  const currentRegions: string[] =
    regions.find((r) => r.region === selectedCity)?.subRegions.map((s) => s.subName) ?? [];

  return (
    <div className="bg-white rounded-xl shadow-[0_0_10px_rgba(0,0,0,0.1)] p-6 my-10">
      <div className="flex gap-4 mt-2 mb-10 ml-4">
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
        <div className="grid grid-cols-2 gap-8 text-sm mb-6">
          {regions.map((r) => (
            <button
              key={r.region}
              onClick={() => {
                onSelectCity(r.region);
                setTab('region');
              }}
              className={`${
                selectedCity === r.region ? 'text-primary font-semibold' : 'text-gray-400'
              }`}
            >
              {r.region}
            </button>
          ))}
        </div>
      )}

      {tab === 'region' && selectedCity && (
        <div className="grid grid-cols-2 gap-6 text-sm my-6">
          {city?.subRegions.map((sr) => (
            <button
              key={sr.id}
              onClick={() => onSelectRegion(sr.subName, sr.id)}
              className={`${
                selectedRegion === sr.subName ? 'text-primary font-semibold' : 'text-gray-400'
              }`}
            >
              {sr.subName}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
