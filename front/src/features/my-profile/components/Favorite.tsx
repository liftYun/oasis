'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import HeartDefault from '@/assets/icons/heart-default.png';
import HeartBlue from '@/assets/icons/heart-blue.png';
import Star from '@/assets/icons/star.png';
import Usdc from '@/assets/icons/usd-circle.png';
import { fetchWishes, deleteWish } from '@/services/stay.api';
import { WishResponseDto } from '@/services/stay.types';
import BackHeader from '@/components/molecules/BackHeader';
import { useLanguage } from '@/features/language';
import { profileMessages } from '@/features/my-profile/locale';

export function Favorite() {
  const [favorites, setFavorites] = useState<WishResponseDto[]>([]);
  const { lang } = useLanguage();
  const t = profileMessages[lang];

  useEffect(() => {
    const loadWishes = async () => {
      try {
        const res = await fetchWishes();
        if (res.isSuccess) {
          setFavorites(res.result);
        }
      } catch (err) {
        console.error('관심숙소 목록 조회 실패', err);
      }
    };

    loadWishes();
  }, []);

  const handleRemove = async (id: number) => {
    try {
      await deleteWish(id);
      setFavorites((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error('관심숙소 삭제 실패', err);
    }
  };

  return (
    <main className="flex flex-col w-full px-6 py-10 min-h-screen">
      <BackHeader title={t.wishlist} />
      <div
        className="flex flex-wrap justify-center mt-10 mb-20 mx-auto"
        style={{ gap: 'clamp(1rem, 2.5rem, 3rem)' }}
      >
        {favorites.map((item) => (
          <div key={item.id} className="flex-shrink-0 w-40">
            <div className="relative w-40 h-40 rounded-xl shadow-sm overflow-hidden">
              <Image
                src={item.stayCardDto.thumbnail ?? '/images/default-thumb.jpg'}
                alt={item.stayCardDto.title}
                fill
                className="object-cover"
              />

              <Image
                src={(item as any).isLiked === false ? HeartDefault : HeartBlue}
                alt="heart"
                width={28}
                height={28}
                className="absolute top-2 right-2 opacity-80 cursor-pointer hover:scale-110 transition"
                onClick={() => handleRemove(item.id)}
              />

              <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-yellow-300/80 px-2 py-1 rounded-full">
                <Image src={Star} alt="star" width={14} height={14} className="opacity-60" />
                <span className="text-xs text-gray-800 font-medium">
                  {item.stayCardDto.rating.toFixed(1)}
                </span>
              </div>
            </div>

            <p className="mt-3 mx-1 text-sm text-gray-600 font-semibold truncate text-left">
              {item.stayCardDto.title}
            </p>

            <div className="flex items-center gap-1.5 mx-1 mt-1">
              <Image src={Usdc} alt="usdc" width={16} height={16} className="shrink-0" />
              <p className="text-sm text-gray-600 font-medium truncate">
                {item.stayCardDto.price.toLocaleString()} 원
              </p>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
