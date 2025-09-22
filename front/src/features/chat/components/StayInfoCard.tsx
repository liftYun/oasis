'use client';

import Image, { type StaticImageData } from 'next/image';
import { useRouter } from 'next/navigation';
import StayImage from '@/assets/images/stay_example.png';
import { ChatUserThumbnail } from '@/components/atoms/ChatUserThumbnail';
import ZoomIn from '@/assets/icons/zoom-in.png';
import { useLanguage } from '@/features/language';
import { chatMessages } from '@/features/chat/locale';

type StayInfo = {
  id: string;
  title: string;
  address: string;
  thumbnailUrl?: string | StaticImageData;
  opponentProfileUrl?: string | null;
};

interface StayInfoCardProps {
  stay: StayInfo;
}

export default function StayInfoCard({ stay }: StayInfoCardProps) {
  const router = useRouter();
  const { lang } = useLanguage();
  const t = chatMessages[lang];

  const goDetail = () => {
    // 추후 실제 숙소 상세 경로로 연결 예정
    router.push(`/stays/${encodeURIComponent(stay.id)}`);
  };

  return (
    <button
      type="button"
      onClick={goDetail}
      className="w-full text-left rounded-xl shadow-md border border-white px-3"
      aria-label="go-stay-detail"
    >
      <div className="flex items-center gap-6 py-2 hover:bg-gray-50">
        {/* 래퍼 분리: 아바타가 이미지 밖으로 자연스럽게 튀어나오도록 */}
        <div className="relative h-16 w-16 flex-shrink-0">
          <div className="relative h-full w-full rounded overflow-hidden bg-gray-100">
            <Image
              src={
                typeof stay.thumbnailUrl === 'string' && stay.thumbnailUrl.length > 0
                  ? stay.thumbnailUrl
                  : StayImage
              }
              alt={stay.title}
              fill
              className="object-cover"
            />
          </div>
          <div className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 z-10">
            <ChatUserThumbnail
              size={38}
              src={
                typeof stay.opponentProfileUrl === 'string' && stay.opponentProfileUrl.length > 0
                  ? stay.opponentProfileUrl
                  : undefined
              }
            />
          </div>
        </div>

        <div className="min-w-0 flex-1 ms-1 items-center">
          <p className="truncate text-base font-bold text-gray-600">{stay.title}</p>
          <p className=" truncate text-sm text-gray-400">{stay.address}</p>

          <div className="mt-2 text-xs text-gray-500 inline-flex items-center gap-2">
            <Image src={ZoomIn} alt={t.seeMore} width={14} height={14} />
            <span>{t.seeMore}</span>
          </div>
        </div>
      </div>
    </button>
  );
}
