'use client';

import Image, { StaticImageData } from 'next/image';
import { useState } from 'react';
import { Star, ClipboardList, ChevronRight } from 'lucide-react';
import BackHeader from '@/components/molecules/BackHeader';
import { useLanguage } from '@/features/language';
import { profileMessages } from '@/features/my-profile';
import TestRoom from '@/assets/images/test-room.jpeg';
import Marker from '@/assets/icons/marker.png';
import Calender from '@/assets/icons/calender.png';
import { ReviewBottomSheet } from '@/features/my-profile';

type Reservation = {
  id: number;
  name: string;
  address: string;
  startDate: string;
  endDate: string;
  adults: number;
  children: number;
  imageUrl: StaticImageData;
  isCompleted: boolean;
};

const sampleData: Reservation[] = [
  {
    id: 1,
    name: '광안 바이브',
    address: '부산 수영구 민락수변로 7',
    startDate: '25.09.01',
    endDate: '25.09.08',
    adults: 2,
    children: 3,
    imageUrl: TestRoom,
    isCompleted: false,
  },
  {
    id: 2,
    name: '광안 바이브',
    address: '부산 수영구 민락수변로 7',
    startDate: '25.09.01',
    endDate: '25.09.08',
    adults: 2,
    children: 3,
    imageUrl: TestRoom,
    isCompleted: true,
  },
];

export function Reservations() {
  const { lang } = useLanguage();
  const t = profileMessages[lang];
  const [reservations] = useState(sampleData);
  const [open, setOpen] = useState(false);

  return (
    <div className="max-w-md mx-auto p-4">
      <BackHeader title={t.reservationHistory} />

      <div className="space-y-8 pt-16">
        {reservations.map((item) => (
          <div key={item.id} className="relative rounded-md overflow-hidden shadow-sm bg-gray-100">
            <div className="flex">
              <div className="relative w-36 h-36 flex-shrink-0">
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  fill
                  className="object-cover rounded-md"
                />
              </div>

              <div className="flex flex-col justify-center pl-8 pr-3 py-3 flex-1 gap-2">
                <div className="flex justify-between">
                  <h2 className="font-semibold text-gray-600 items-bottom">{item.name}</h2>
                  <ChevronRight className="text-gray-400 items-top" />
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Image src={Marker} alt="marker" width={14} height={14} className="shrink-0" />
                  <span className="truncate">{item.address}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Image
                    src={Calender}
                    alt="calender"
                    width={14}
                    height={14}
                    className="shrink-0"
                  />
                  <span>{item.startDate}</span>
                  <span>~</span>
                  <span>{item.endDate}</span>
                </div>
              </div>
            </div>

            {item.isCompleted && (
              <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white">
                <p className="mb-2">이용 완료한 숙소 입니다.</p>
                <div className="flex space-x-4">
                  <button
                    onClick={() => setOpen(true)}
                    className="flex items-center space-x-1 text-sm"
                  >
                    <Star size={16} />
                    <span>리뷰 작성하기</span>
                  </button>

                  <button className="flex items-center space-x-1 text-sm">
                    <ClipboardList size={16} />
                    <span>내역 확인하기</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <ReviewBottomSheet open={open} onClose={() => setOpen(false)} />
    </div>
  );
}
