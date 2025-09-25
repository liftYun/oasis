'use client';

import Image from 'next/image';
import Link from 'next/link';
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
import { Lottie } from '@/components/atoms/Lottie';
import { useAuthStore } from '@/stores/useAuthStores';
import { useRouter } from 'next/navigation';

export function Favorite() {
  const [favorites, setFavorites] = useState<WishResponseDto[]>([]);
  const { lang } = useLanguage();
  const t = profileMessages[lang];
  const { profileUrl, nickname } = useAuthStore();
  const router = useRouter();

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

      {favorites.length === 0 ? (
        <div className="flex flex-col flex-1 items-center justify-center p-4 pb-56">
          <Lottie src="/lotties/empty.json" className="w-100 h-40" />
          <p className="mt-4 text-center text-gray-500">{t.noWishlist}</p>
        </div>
      ) : (
        <>
          <div className="mt-6 mb-8 flex items-center gap-4 bg-gradient-to-r from-[#dbeafe] to-[#e0f2f1] p-4 rounded-md">
            <button
              onClick={() => router.push('/my-profile')}
              className="p-[3px] rounded-full bg-gradient-to-r from-primary to-green hover:opacity-90 transition"
            >
              <div className="w-14 h-14 rounded-full overflow-hidden bg-white">
                <Image
                  src={profileUrl ?? '/images/default-profile.png'}
                  alt="profile"
                  width={56}
                  height={56}
                  className="object-cover w-full h-full"
                />
              </div>
            </button>

            <div>
              <h1 className="text-lg font-bold text-gray-800">
                {nickname
                  ? `${nickname} ${lang === 'kor' ? '님의 관심 숙소' : `'s Wishlist`}`
                  : t.wishlist}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                {favorites.length} {lang === 'kor' ? '개의 관심 숙소' : 'favorites'}
              </p>
            </div>
          </div>

          <div
            className="flex flex-wrap justify-center mb-20 mx-auto"
            style={{ gap: 'clamp(1rem, 2.5rem, 3rem)' }}
          >
            {favorites.map((item) => (
              <div key={item.id} className="flex-shrink-0 w-40">
                <Link href={`/stays/${item.stayCardDto.stayId}`} className="block">
                  <div className="relative w-40 h-40 rounded-xl shadow-sm hover:shadow-md transition overflow-hidden">
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
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleRemove(item.id);
                      }}
                    />

                    <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-yellow/70 px-2 py-1 rounded-full">
                      <Image src={Star} alt="star" width={14} height={14} className="opacity-60" />
                      <span className="text-xs text-gray-600 font-medium">
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
                </Link>
              </div>
            ))}
          </div>
        </>
      )}
    </main>
  );
}
