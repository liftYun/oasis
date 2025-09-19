// 채팅 리스트 아이템 컴포넌트
'use client';

import Image from 'next/image';
import Link from 'next/link';
import StayImage from '@/assets/images/stay_example.png';
import { useLanguage } from '@/features/language';
import { chatMessages } from '@/features/chat/locale';
import { ChatUserThumbnail } from '@/components/atoms/ChatUserThumbnail';

type ChatListItemProps = {
  id: string;
  title: string;
  location: string;
  date: string;
  thumbnailUrl?: string;
  opponentProfileUrl?: string;
};

export function ChatListItem({
  id,
  title,
  location,
  date,
  thumbnailUrl,
  opponentProfileUrl,
}: ChatListItemProps) {
  const { lang } = useLanguage();
  const t = chatMessages[lang];
  return (
    <Link
      href={`/chat/${encodeURIComponent(id)}`}
      aria-label={`${t.ariaOpenChat}: ${title}`}
      className="flex items-center gap-4 py-5 hover:bg-gray-50"
    >
      {/* 래퍼 분리: 아바타가 이미지 밖으로 자연스럽게 튀어나오도록 */}
      <div className="relative h-16 w-16 flex-shrink-0">
        <div className="relative h-full w-full rounded overflow-hidden bg-gray-100">
          <Image src={thumbnailUrl || StayImage} alt={title} fill className="object-cover" />
        </div>
        <div className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 z-10">
          <ChatUserThumbnail size={38} src={opponentProfileUrl} />
        </div>
      </div>

      <div className="min-w-0 flex-1 ms-1">
        <p className="truncate text-base font-bold text-gray-600">{title}</p>
        <p className="mt-1 truncate text-sm text-gray-400">{location}</p>
      </div>

      <span className="text-xs text-gray-300 mt-3 mb-auto">{date}</span>
    </Link>
  );
}

export default ChatListItem;
