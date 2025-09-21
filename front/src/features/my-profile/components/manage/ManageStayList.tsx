'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import BackHeader from '@/components/molecules/BackHeader';
import { useLanguage } from '@/features/language';
import { profileMessages } from '@/features/my-profile';
import { fetchMyStays } from '@/services/user.api';
import type { StayCardView } from '@/services/user.types';
import Logo from '@/assets/logos/oasis-logo-512.png';
import Star from '@/assets/icons/star.png';
import Usdc from '@/assets/icons/usd-circle.png';

export function ManageStayList() {
  const { lang } = useLanguage();
  const t = profileMessages[lang];
  const [stays, setStays] = useState<StayCardView[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetchMyStays();
        setStays(res.result || []);
      } catch (err) {
        console.error('내 숙소 불러오기 실패:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <div className="p-6 text-gray-500">Loading...</div>;

  return (
    <main className="flex flex-col w-full px-6 py-10 min-h-screen">
      <BackHeader title={t.manageStay} />
      {stays.length === 0 ? (
        <p className="mt-20 text-center text-gray-400 text-sm">등록된 숙소가 없습니다.</p>
      ) : (
        <div className="mt-10 grid grid-cols-2 place-items-center gap-6">
          {stays.map((stay) => (
            <Link
              key={stay.stayId}
              href={`/stays/${stay.stayId}?from=manage`}
              className="group relative w-[200px] rounded-xl overflow-hidden shadow hover:shadow-lg transition"
            >
              <div className="relative aspect-square rounded-xl overflow-hidden shadow hover:shadow-lg transition">
                <Image
                  src={stay.thumbnail || Logo}
                  alt={stay.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />

                <div className="absolute bottom-0 inset-x-0 bg-black/50  text-white px-4 py-3">
                  <p className="text-sm font-semibold truncate">{stay.title}</p>
                  <div className="flex items-center justify-between text-xs mt-1">
                    <div className="flex items-center gap-1">
                      <Image
                        src={Star}
                        alt="star"
                        width={12}
                        height={12}
                        className="brightness-0 invert"
                      />
                      <span>{stay.rating.toFixed(1)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Image
                        src={Usdc}
                        alt="usdc"
                        width={12}
                        height={12}
                        className="brightness-0 invert"
                      />
                      <span className="font-semibold">{stay.price.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
