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
    router.push(`/stays/${encodeURIComponent(stay.id)}`);
  };

  return (
    <button type="button" className="w-full text-left rounded-md px-3" aria-label="go-stay-detail">
      <div className="flex items-center gap-4 rounded-md bg-white p-6 shadow-sm mt-4">
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

        <div className="min-w-0 flex-1 ms-2 items-center">
          <p className="truncate text-base font-bold text-gray-600">{stay.title}</p>
          <p className=" truncate text-sm text-gray-400">{stay.address}</p>

          <button
            className="mt-2 flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600"
            onClick={goDetail}
          >
            <Image src={ZoomIn} alt="zoom" width={12} height={12} />
            {t.seeMore}
          </button>
        </div>
      </div>
    </button>
  );
}
