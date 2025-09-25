'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import SearchBar from '@/components/molecules/SearchBar';
import PromoCard from '@/components/organisms/promo-card/PromoCard';
import { useSearchStore } from '@/stores/useSearchStores';
import HeartDefault from '@/assets/icons/heart-default.png';
import HeartBlue from '@/assets/icons/heart-blue.png';
import Star from '@/assets/icons/star.png';
import Usdc from '@/assets/icons/usd-circle.png';
import Logo from '@/assets/logos/oasis-logo-512.png';
import { addWish, deleteWish, fetchWishes } from '@/services/stay.api';
import { WishResponseDto } from '@/services/stay.types';

export function SearchResult() {
  const results = useSearchStore((s) => s.results);
  const [favorites, setFavorites] = useState<Record<number, number>>({});

  useEffect(() => {
    const loadWishes = async () => {
      try {
        const res = await fetchWishes();
        const wishMap = res.result.reduce(
          (acc, wish: WishResponseDto) => {
            acc[wish.stayCardDto.stayId] = wish.id;
            return acc;
          },
          {} as Record<number, number>
        );
        setFavorites(wishMap);
      } catch (e) {
        console.error('관심 숙소 불러오기 실패:', e);
      }
    };
    loadWishes();
  }, []);

  const handleToggleFavorite = async (stayId: number) => {
    try {
      if (favorites[stayId]) {
        await deleteWish(favorites[stayId]);
        setFavorites((prev) => {
          const copy = { ...prev };
          delete copy[stayId];
          return copy;
        });
      } else {
        await addWish(stayId);
        const res = await fetchWishes();
        const wishMap = res.result.reduce(
          (acc, wish: WishResponseDto) => {
            acc[wish.stayCardDto.stayId] = wish.id;
            return acc;
          },
          {} as Record<number, number>
        );
        setFavorites(wishMap);
      }
    } catch (e) {
      console.error('관심 숙소 토글 실패:', e);
    }
  };

  return (
    <main className="flex flex-col w-full px-6 pb-10 pt-6 min-h-screen">
      <SearchBar />
      <div className="mt-6">
        <PromoCard />
      </div>

      <div className="grid grid-cols-2 gap-6 mt-6 mb-40 mx-auto w-full max-w-md">
        {results.map((stay) => (
          <div key={stay.stayId} className="w-full">
            <div className="relative group">
              <Link href={`/stays/${stay.stayId}`} className="block w-full">
                <div className="relative aspect-square rounded-xl shadow-sm hover:shadow-md transition overflow-hidden">
                  <Image
                    src={stay.thumbnail || Logo}
                    alt={stay.title}
                    fill
                    className="object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = Logo.src;
                    }}
                  />

                  <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-yellow/70 px-2 py-1 rounded-full">
                    <Image src={Star} alt="star" width={14} height={14} className="opacity-60" />
                    <span className="text-xs text-gray-600 font-medium">
                      {stay.rating.toFixed(1)}
                    </span>
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
              </Link>

              <Image
                src={favorites[stay.stayId] ? HeartBlue : HeartDefault}
                alt="heart"
                width={28}
                height={28}
                className="absolute top-2 right-2 opacity-80 cursor-pointer hover:scale-110 transition"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleToggleFavorite(stay.stayId);
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
