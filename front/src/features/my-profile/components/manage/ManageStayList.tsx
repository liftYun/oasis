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
import { Lottie } from '@/components/atoms/Lottie';
import { useAuthStore } from '@/stores/useAuthStores';
import { useRouter } from 'next/navigation';

export function ManageStayList() {
  const { lang } = useLanguage();
  const t = profileMessages[lang];
  const [stays, setStays] = useState<StayCardView[]>([]);
  const [loading, setLoading] = useState(true);
  const { profileUrl, nickname } = useAuthStore();
  const router = useRouter();

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

  if (loading)
    return (
      <>
        <div className="flex flex-col min-h-screen items-center justify-center p-4 pb-56">
          <Lottie src="/lotties/spinner.json" className="w-20 h-20" />
          <p className="mt-2 text-center text-gray-500">{t.loading}</p>
        </div>
      </>
    );

  return (
    <main className="flex flex-col w-full px-6 py-10 min-h-screen">
      <BackHeader title={t.manageStay} />
      {stays.length === 0 ? (
        <div className="flex flex-col flex-1 items-center justify-center p-4 pb-56">
          <Lottie src="/lotties/empty.json" className="w-100 h-40" />
          <p className="mt-4 text-center text-gray-500">{t.noStay}</p>
        </div>
      ) : (
        <>
          <div className="mt-6 mb-8 flex items-center gap-4 from-[#dbeafe] to-[#e0f2f1] p-4 rounded-md">
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
                  ? `${nickname} ${lang === 'kor' ? '님의 등록 숙소' : `'s stays`}`
                  : t.wishlist}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                {stays.length} {lang === 'kor' ? '개의 등록 숙소' : 'stays'}
              </p>
            </div>
          </div>

          <div
            className="flex flex-wrap justify-center mb-20 mx-auto"
            style={{ gap: 'clamp(1rem, 2.5rem, 3rem)' }}
          >
            {stays.map((stay) => (
              <Link
                key={stay.stayId}
                href={`/stays/${stay.stayId}?from=manage`}
                className="group relative w-full rounded-xl overflow-hidden shadow hover:shadow-lg transition"
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
        </>
      )}
    </main>
  );
}
