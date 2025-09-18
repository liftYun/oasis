'use client';

import { useState } from 'react';
import type { DateRange } from 'react-day-picker';
import { SearchTabs, SearchSelector } from '@/features/search';
import Calendar from '@/components/organisms/Calender';
import { Button } from '@/components/atoms/Button';
import { searchStays } from '@/services/stay.api';
import { StayCardDto } from '@/services/stay.types';

export function Search() {
  const [activeTab, setActiveTab] = useState<'region' | 'date'>('region');

  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [selectedSubRegionId, setSelectedSubRegionId] = useState<number | null>(null);

  const [selectedRange, setSelectedRange] = useState<DateRange | undefined>(undefined);

  const [stays, setStays] = useState<StayCardDto[]>([]);

  const handleSearch = async () => {
    try {
      const stayQuery = {
        subRegionId: selectedSubRegionId ?? undefined,
        checkIn: selectedRange?.from?.toISOString().slice(0, 10),
        checkout: selectedRange?.to?.toISOString().slice(0, 10),
      };

      const params = {
        lastStayId: 0,
        stayQuery,
      };

      const { result } = await searchStays(params);
      setStays(result ?? []);
    } catch (e) {
      console.error('숙소 검색 실패:', e);
    }
  };

  return (
    <main className="flex flex-col w-full min-h-screen px-6 py-4 pt-24 items-stretch justify-start overflow-y-auto">
      <SearchTabs activeTab={activeTab} onTabChange={setActiveTab} selectedRegion={selectedCity} />

      {activeTab === 'region' && (
        <SearchSelector
          selectedCity={selectedCity}
          onSelectCity={setSelectedCity}
          selectedRegion={selectedRegion}
          onSelectRegion={(name, id) => {
            setSelectedRegion(name);
            setSelectedSubRegionId(id);
          }}
        />
      )}

      {activeTab === 'date' && <Calendar value={selectedRange} onChange={setSelectedRange} />}

      <div className="mt-auto mb-6">
        <Button
          variant={
            selectedSubRegionId && selectedRange?.from && selectedRange?.to ? 'blue' : 'blueLight'
          }
          className="w-full max-w-lg mx-auto"
          onClick={handleSearch}
        >
          검색
        </Button>
      </div>
    </main>
  );
}
