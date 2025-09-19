'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useLanguage } from '@/features/language';
import { mainMessages } from '@/features/main';
import { Lang, MainMessagesMap } from '@/features/main/types';
import { Lottie } from '@/components/atoms/Lottie';
import { ChevronRight } from 'lucide-react';
import Logo from '@/assets/logos/oasis-logo-512.png';
import HeartBlue from '@/assets/icons/heart-blue.png';
import HeartDefault from '@/assets/icons/heart-default.png';
import Star from '@/assets/icons/star.png';
import PositiveReview from '@/assets/icons/positive-review.png';
import MainCard from '@/components/organisms/main-card/MainCard';
import Usdc from '@/assets/icons/usd-circle.png';
import { useEffect, useRef, useState } from 'react';
import { searchStaysByWish, searchStaysByRating } from '@/services/stay.api';
import { StayCardByWishDto } from '@/services/stay.types';

function ScrollableRoomList({ rooms }: { rooms: StayCardByWishDto[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showArrow, setShowArrow] = useState(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const handleScroll = () => {
      const isAtStart = el.scrollLeft < 5;
      setShowArrow(isAtStart);
    };

    el.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => el.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className="overflow-x-auto scrollbar-hide cursor-grab active:cursor-grabbing relative"
      ref={scrollRef}
    >
      <div className="flex gap-4 w-max px-1">
        {rooms.map((room) => (
          <div key={room.stayId} className="flex-shrink-0 w-40">
            <div className="relative w-40 h-40 rounded-xl shadow-sm hover:shadow-md transition overflow-hidden">
              <Image src={room.thumbnail} alt={room.title} fill className="object-cover" />
              <Image
                src={HeartDefault}
                alt="heart"
                width={28}
                height={28}
                className="absolute top-2 right-2 opacity-70"
              />
              <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-yellow/70 px-2 py-1 rounded-full">
                <Image src={Star} alt="star" width={14} height={14} className="opacity-60" />
                <span className="text-xs text-gray-600 font-medium">{room.rating.toFixed(1)}</span>
              </div>
            </div>

            <p className="mt-3 mx-1 text-sm text-gray-600 font-semibold truncate text-left">
              {room.title}
            </p>
            <div className="flex items-center gap-1.5 mx-1 mt-1">
              <Image src={Usdc} alt="usdc" width={16} height={16} className="shrink-0" />
              <p className="text-sm text-gray-600 font-medium truncate">
                {room.price.toLocaleString()} 원
              </p>
            </div>
          </div>
        ))}
      </div>

      <div
        className={`pointer-events-none absolute top-1/2 -translate-y-1/2 right-3 transition-opacity duration-300 ${
          showArrow ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white/50 text-primary shadow-md animate-bounce-x">
          <ChevronRight size={20} />
        </div>
      </div>
    </div>
  );
}

export function GuestMain() {
  const { lang } = useLanguage();
  const t: MainMessagesMap[Lang] = mainMessages[lang];
  const router = useRouter();
  const [wishRooms, setWishRooms] = useState<StayCardByWishDto[]>([]);
  const [ratingRooms, setRatingRooms] = useState<StayCardByWishDto[]>([]);

  const fetchData = async () => {
    try {
      const wishRes = await searchStaysByWish();
      setWishRooms(Array.isArray(wishRes?.result) ? wishRes.result : []);

      const ratingRes = await searchStaysByRating();
      setRatingRooms(Array.isArray(ratingRes?.result) ? ratingRes.result : []);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <main
      className="flex flex-col w-full px-6 pb-10 min-h-screen"
      style={{ paddingBottom: 'var(--safe-bottom, 110px)' }}
    >
      <section className="mt-6">
        <div className="relative w-full h-[18rem] flex flex-col items-center justify-center">
          <Lottie src="/lotties/search.json" className="w-[90%] h-40" />
          <div className="absolute top-6 inset-x-0 text-center px-6">
            <h2 className="text-xl font-bold text-gray-600 mb-1 drop-shadow-sm">{t.searchTitle}</h2>
            <p className="text-sm text-gray-400">{t.searchSubtitle}</p>
          </div>
          <button
            onClick={() => router.push('/search')}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 w-full py-3 rounded-md bg-primary text-white text-sm font-medium hover:opacity-90 transition"
          >
            {t.search}
          </button>
        </div>
      </section>

      <section className="mt-10 relative">
        <div className="flex items-center gap-4 px-1 mb-6">
          <Image src={HeartBlue} alt="heart" width={44} height={44} />
          <div className="flex flex-col">
            <h3 className="text-lg font-semibold text-gray-700">{t.likedTitle}</h3>
            <p className="text-sm text-gray-400">{t.likedSubtitle}</p>
          </div>
        </div>
        <ScrollableRoomList rooms={wishRooms} />
      </section>

      <section className="mt-20 mb-10 relative">
        <div className="flex items-center gap-4 px-1 mb-6">
          <Image src={PositiveReview} alt="review" width={44} height={44} />
          <div className="flex flex-col">
            <h3 className="text-lg font-semibold text-gray-700">{t.favoriteTitle}</h3>
            <p className="text-sm text-gray-400">{t.favoriteSubtitle}</p>
          </div>
        </div>
        <ScrollableRoomList rooms={wishRooms} />
      </section>

      <div className="-mx-6 w-screen h-3 bg-gray-100 my-8" />

      <section className="mt-10">
        <div className="flex items-center gap-4 px-1 mb-10">
          <Image src={Logo} alt="logo" width={44} height={44} />
          <div className="flex flex-col">
            <h3 className="text-lg font-semibold text-gray-700">{t.brandTitle}</h3>
            <p className="text-sm text-gray-400">{t.brandPrefix}</p>
          </div>
        </div>
        <MainCard />
      </section>
    </main>
  );
}
