'use client';

import { useState } from 'react';
import { SearchTabs, SearchSelector } from '@/features/search';
import Calendar from '@/components/organisms/Calender';
import { Button } from '@/components/atoms/Button';

export function Search() {
  const [activeTab, setActiveTab] = useState<'region' | 'date'>('region');
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  const handleSearch = () => {
    console.log('검색 실행:', { activeTab, selectedCity });
  };

  return (
    <main className="flex flex-col w-full min-h-screen px-6 py-4 items-stretch justify-start pt-24">
      <SearchTabs activeTab={activeTab} onTabChange={setActiveTab} selectedRegion={selectedCity} />

      {activeTab === 'region' && (
        <SearchSelector
          selectedCity={selectedCity}
          onSelectCity={setSelectedCity}
          selectedRegion={selectedRegion}
          onSelectRegion={setSelectedRegion}
        />
      )}

      {activeTab === 'date' && <Calendar />}

      <div className="mt-auto mb-6">
        <Button
          variant="default"
          className="w-full max-w-lg mx-auto"
          onClick={handleSearch}
          disabled={!selectedCity}
        >
          검색
        </Button>
      </div>
    </main>
  );
}
