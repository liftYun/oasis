'use client';

import Image from 'next/image';
import { useState } from 'react';
import SearchBar from '@/components/molecules/SearchBar';
import PromoCard from '@/components/organisms/promo-card/PromoCard';
import { useSearchStore } from '@/stores/useSearchStore';
import HeartDefault from '@/assets/icons/heart-default.png';
import HeartBlue from '@/assets/icons/heart-blue.png';
import Star from '@/assets/icons/star.png';
import Usdc from '@/assets/icons/usd-circle.png';
import { addWish } from '@/services/stay.api';

export function SearchResult() {
  const results = useSearchStore((s) => s.results);
  const [favorites, setFavorites] = useState<number[]>([]);

  const handleToggleFavorite = async (stayId: number) => {
    try {
      await addWish(stayId);
      setFavorites((prev) =>
        prev.includes(stayId) ? prev.filter((id) => id !== stayId) : [...prev, stayId]
      );
    } catch (e) {
      console.error('관심숙소 등록 실패:', e);
    }
  };

  return (
    <main className="flex flex-col w-full px-6 py-10 min-h-screen">
      <SearchBar />
      <div className="mt-6">
        <PromoCard />
      </div>

      <div
        className="flex flex-wrap justify-center mt-6 mb-20 mx-auto"
        style={{ gap: 'clamp(1rem, 2.5rem, 3rem)' }}
      >
        {results.map((stay) => (
          <div key={stay.stayId} className="flex-shrink-0 w-40">
            <div className="relative w-40 h-40 rounded-xl shadow-sm transition overflow-hidden">
              <Image
                src={
                  stay.thumbnail && stay.thumbnail !== 'null'
                    ? stay.thumbnail
                    : 'https://stay-oasis.s3.ap-northeast-2.amazonaws.com/null'
                }
                alt={stay.title}
                fill
                className="object-cover"
              />

              <Image
                src={favorites.includes(stay.stayId) ? HeartBlue : HeartDefault}
                alt="heart"
                width={28}
                height={28}
                className="absolute top-2 right-2 opacity-80 cursor-pointer hover:scale-110 transition"
                onClick={() => handleToggleFavorite(stay.stayId)}
              />

              <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-yellow/70 px-2 py-1 rounded-full">
                <Image src={Star} alt="star" width={14} height={14} className="opacity-60" />
                <span className="text-xs text-gray-600 font-medium">{stay.rating.toFixed(1)}</span>
              </div>
            </div>

            <p className="mt-3 mx-1 text-sm text-gray-600 font-semibold truncate text-left">
              {stay.title}
            </p>
            <div className="flex items-center gap-1.5 mx-1 mt-1">
              <Image src={Usdc} alt="usdc" width={16} height={16} className="shrink-0" />
              <p className="text-sm text-gray-600 font-medium truncate">
                {stay.price.toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
