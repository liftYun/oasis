'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useLanguage } from '@/features/language';
import { mainMessages } from '@/features/main';
import { Lang, MainMessagesMap } from '@/features/main/types';
import SearchBar from '@/components/molecules/SearchBar';
import { Lottie } from '@/components/atoms/Lottie';
import { ChevronRight } from 'lucide-react';
import Logo from '@/assets/logos/oasis-logo-512.png';
import HeartBlue from '@/assets/icons/heart-blue.png';
import HeartDefault from '@/assets/icons/heart-default.png';
import Star from '@/assets/icons/star.png';
import PositiveReview from '@/assets/icons/positive-review.png';
import MainCard from '@/components/organisms/main-card/MainCard';
import Usdc from '@/assets/icons/usd-circle.png';
import TestRoom from '@/assets/images/test-room.jpeg';
import { useEffect, useRef, useState } from 'react';

function ScrollableRoomList({ rooms }: { rooms: typeof mockRooms }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showArrow, setShowArrow] = useState(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const handleScroll = () => {
      const { scrollLeft } = el;

      const isAtStart = scrollLeft < 5;

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
        {rooms.map((room, i) => (
          <div key={i} className="flex-shrink-0 w-40">
            <div className="relative w-40 h-40 rounded-xl shadow-sm hover:shadow-md transition overflow-hidden">
              <Image src={room.image} alt={room.name} fill className="object-cover" />
              <Image
                src={HeartDefault}
                alt="heart"
                width={28}
                height={28}
                className="absolute top-2 right-2 opacity-70"
              />
              <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-yellow/70 px-2 py-1 rounded-full">
                <Image src={Star} alt="star" width={14} height={14} className="opacity-60" />
                <span className="text-xs text-gray-600 font-medium">{room.rating}</span>
              </div>
            </div>

            <p className="mt-3 mx-1 text-sm text-gray-700 font-semibold truncate text-left">
              {room.name}
            </p>
            <div className="flex items-center gap-1.5 mx-1 mt-1">
              <Image src={Usdc} alt="usdc" width={16} height={16} className="shrink-0" />
              <p className="text-sm text-gray-600 font-medium truncate">{room.price}</p>
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

const mockRooms = [...Array(12)].map((_, i) => ({
  name: `숙소 ${i + 1}`,
  price: '125,000 원',
  rating: '4.8',
  image: TestRoom,
}));

export function GuestMain() {
  const { lang } = useLanguage();
  const t: MainMessagesMap[Lang] = mainMessages[lang];
  const router = useRouter();

  return (
    <main
      className="flex flex-col w-full px-6 py-10 min-h-screen"
      style={{ paddingBottom: 'var(--safe-bottom, 110px)' }}
    >
      <SearchBar />

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
        <ScrollableRoomList rooms={mockRooms} />
      </section>

      <section className="mt-20 mb-10 relative">
        <div className="flex items-center gap-4 px-1 mb-6">
          <Image src={PositiveReview} alt="review" width={44} height={44} />
          <div className="flex flex-col">
            <h3 className="text-lg font-semibold text-gray-700">{t.favoriteTitle}</h3>
            <p className="text-sm text-gray-400">{t.favoriteSubtitle}</p>
          </div>
        </div>
        <ScrollableRoomList rooms={mockRooms} />
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
