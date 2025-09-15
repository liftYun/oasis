'use client';

import SearchBar from '@/components/molecules/SearchBar';
import PromoCard from '@/components/organisms/promo-card/PromoCard';

export function SearchMain() {
  return (
    <main className="flex flex-col w-full px-6 py-10 min-h-screen">
      <SearchBar />
      <div className="mt-6">
        <PromoCard />
      </div>
    </main>
  );
}
