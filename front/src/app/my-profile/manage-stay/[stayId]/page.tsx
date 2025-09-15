'use client';

import { useParams } from 'next/navigation';
import { useState } from 'react';
import Image from 'next/image';
import ReservationTab from '@/features/my-profile/components/ReservationTab';
import EditInfoTab from '@/features/my-profile/components/EditInfoTab';
import ZoomIn from '@/assets/icons/zoom-in.png';

const stays = [
  {
    id: '1',
    name: '광안 바이브',
    location: '부산 수영구 민락수변로 7 6층 601호',
    image: '/images/stay1.jpg',
  },
  {
    id: '2',
    name: '해운대 스테이',
    location: '부산 해운대구 해변로 32',
    image: '/images/stay2.jpg',
  },
];

export default function StayManageDetailPage() {
  const params = useParams();
  const stayId = params.stayId as string;
  const [activeTab, setActiveTab] = useState<'reservation' | 'edit'>('reservation');

  const stay = stays.find((s) => s.id === stayId);

  if (!stay) {
    return <p className="p-6 text-center text-gray-500">숙소 정보를 찾을 수 없습니다.</p>;
  }

  return (
    <div className="p-6">
      {/* <BackHeader /> */}

      <div className="flex items-center gap-4 p-4 mb-6 bg-white rounded-xl shadow">
        <div className="relative w-20 h-20 rounded-md overflow-hidden flex-shrink-0">
          <Image src={stay.image} alt={stay.name} fill className="object-cover" />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-base font-semibold text-gray-800">{stay.name}</h2>
          <p className="text-xs text-gray-500 truncate">{stay.location}</p>
          <button className="mt-1 text-xs text-gray-600 flex items-center gap-1.5 hover:underline">
            <Image src={ZoomIn} alt="ZoomIn" width={12}></Image> 자세히 보기
          </button>
        </div>
      </div>

      <div className="flex border-b mb-4">
        <button
          onClick={() => setActiveTab('reservation')}
          className={`flex-1 py-2 text-sm font-medium ${
            activeTab === 'reservation' ? 'border-b-2 border-black text-black' : 'text-gray-400'
          }`}
        >
          예약 관리
        </button>
        <button
          onClick={() => setActiveTab('edit')}
          className={`flex-1 py-2 text-sm font-medium ${
            activeTab === 'edit' ? 'border-b-2 border-black text-black' : 'text-gray-400'
          }`}
        >
          숙소 정보 수정
        </button>
      </div>

      {activeTab === 'reservation' ? <ReservationTab /> : <EditInfoTab />}
    </div>
  );
}
