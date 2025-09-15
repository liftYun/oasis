'use client';

import { useParams } from 'next/navigation';
import { StayImageSlider, StayBookingBar, StayMap, useStayDetail } from '@/features/stays';

export function StayDetail() {
  const params = useParams();
  const id = Number(params.id);
  const { data, isLoading } = useStayDetail(id);

  if (isLoading || !data) return <p className="p-10">로딩 중...</p>;

  return (
    <div className="pb-28">
      <StayImageSlider images={data.images} />

      <div className="px-6 py-4 space-y-6">
        <div>
          <h1 className="text-xl font-semibold">{data.title}</h1>
          <p className="text-gray-500 text-sm">{data.location}</p>
        </div>

        <div>
          <h2 className="font-medium mb-2">숙소 설명</h2>
          <p className="text-sm text-gray-700">{data.description}</p>
        </div>

        <div>
          <h2 className="font-medium mb-2">숙소 위치</h2>
          <StayMap latitude={data.latitude} longitude={data.longitude} />
        </div>
      </div>

      <StayBookingBar price={data.pricePerNight} />
    </div>
  );
}
