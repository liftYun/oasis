'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter, usePathname, useSearchParams } from 'next/navigation';
import { fetchStayDetail } from '@/services/stay.api';
import { StayReadResponseDto, HostInfoResponseDto } from '@/services/stay.types';
import { useLanguage } from '@/features/language';
import { stayDetailLocale } from '@/features/stays/locale';
import StayImageSlider from './StayImageSlider';
import StayBookingBar from './StayBookingBar';
import StayHostBar from './StayHostBar';
import StayMap from './StayMap';
import StayDescription from './StayDescription';
import StayFacilities from './StayFacilities';
import StayReview from './StayReview';
import StayHost from './StayHost';
import { StayHeader } from './StayHeader';

export function StayDetail() {
  const { lang } = useLanguage();
  const t = stayDetailLocale[lang];
  const { id } = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [stay, setStay] = useState<StayReadResponseDto | null>(null);
  const [loading, setLoading] = useState(true);
  const handleChatStart = (host: HostInfoResponseDto) => {
    // router.push(`/chat?hostId=${host.uuid}&hostName=${host.nickname}`);
  };

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      try {
        const res = await fetchStayDetail(Number(id));
        setStay(res.result);
      } catch (e) {
        console.error('숙소 조회 실패:', e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) return <div className="p-6">{t.common.loading}</div>;
  if (!stay) return <div className="p-6">{t.common.loadError}</div>;

  const isManageMode = pathname.startsWith('/manage') || searchParams.get('from') === 'manage';

  return (
    <section className="overflow-y-auto scrollbar-hide flex flex-1 flex-col relative">
      <StayHeader title={stay.title} />
      <StayImageSlider photos={stay.photos} title={stay.title} />

      <main className="relative w-full mx-auto px-6 pb-24">
        <div className="relative text-center justify-between">
          <h1 className="text-2xl font-bold mt-4">{stay.title}</h1>
          <p className="text-gray-400 mt-1">
            {stay.region} · {stay.subRegion}
          </p>
        </div>

        <StayFacilities facilities={stay.facilities} />
        <StayDescription description={stay.description} maxGuests={stay.maxGuest} />
        <StayMap postalCode={stay.postalCode} />
        <StayReview
          rating={stay.review.rating}
          highReviews={stay.review.highRateSummary}
          lowReviews={stay.review.lowRateSummary}
          stayId={stay.stayId}
        />

        <div className="-mx-6 w-screen h-3 bg-gray-100 my-12" />

        <StayHost host={stay.host} onChatStart={handleChatStart} />
      </main>

      {isManageMode ? <StayHostBar stay={stay} /> : <StayBookingBar stay={stay} />}
    </section>
  );
}
