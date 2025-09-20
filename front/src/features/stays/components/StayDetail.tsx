'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { fetchStayDetail } from '@/services/stay.api';
import { StayReadResponseDto } from '@/services/stay.types';
import { useLanguage } from '@/features/language';
import { stayDetailLocale } from '@/features/stays/locale';
import StayImageSlider from './StayImageSlider';
import StayBookingBar from './StayBookingBar';
import StayMap from './StayMap';
import StayDescription from './StayDescription';
import StayFacilities from './StayFacilities';
import StayReview from './StayReview';
import StayHost from './StayHost';

export function StayDetail() {
  const { lang } = useLanguage();
  const t = stayDetailLocale[lang];
  const { id } = useParams();
  const [stay, setStay] = useState<StayReadResponseDto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      try {
        const res = await fetchStayDetail(Number(id));
        setStay(res.result);
        console.log(res.result);
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

  return (
    <section className="overflow-y-auto scrollbar-hide flex flex-1 flex-col">
      <StayImageSlider photos={stay.photos} title={stay.title} />
      <main className="relative w-full mx-auto px-6 pb-24">
        <div className="text-center">
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

        <StayHost host={stay.host} onChatStart={() => console.log('채팅 시작')} />
      </main>
      <StayBookingBar price={stay.price} />
    </section>
  );
}
