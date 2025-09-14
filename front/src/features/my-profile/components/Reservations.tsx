'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Star, ClipboardList } from 'lucide-react';

type Reservation = {
  id: number;
  name: string;
  address: string;
  startDate: string;
  endDate: string;
  adults: number;
  children: number;
  imageUrl: string;
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
    imageUrl: '/images/sample-room.jpg',
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
    imageUrl: '/images/sample-room.jpg',
    isCompleted: true,
  },
];

export function Reservations() {
  const [reservations] = useState(sampleData);

  return (
    <div className="max-w-md mx-auto p-4">
      {/* <BackHeader /> */}

      <div className="space-y-6">
        {reservations.map((item) => (
          <div key={item.id} className="relative rounded-xl overflow-hidden shadow-sm bg-gray-100">
            <div className="flex">
              <div className="relative w-32 h-32 flex-shrink-0">
                <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
              </div>

              <div className="flex flex-col justify-center px-4 py-3 flex-1 gap-1">
                <div>
                  <h2 className="font-semibold text-gray-600 pb-2">{item.name}</h2>
                </div>
                <p className="text-sm text-gray-500">{item.address}</p>
                <p className="text-sm text-gray-500">
                  {item.startDate} ~ {item.endDate}
                </p>
              </div>
            </div>

            {item.isCompleted && (
              <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white">
                <p className="mb-2">이용 완료한 숙소 입니다.</p>
                <div className="flex space-x-4">
                  <button className="flex items-center space-x-1 text-sm">
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
    </div>
  );
}
