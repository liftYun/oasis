// 채팅 리스트 아이템 컴포넌트
'use client';

import Image from 'next/image';
import Link from 'next/link';
import StayImage from '@/assets/images/stay_example.png';
import { useLanguage } from '@/features/language';
import { chatMessages } from '@/features/chat/locale';
import { ChatUserThumbnail } from '@/components/atoms/ChatUserThumbnail';
import { Dot } from 'lucide-react';

type ChatListItemProps = {
  id: string;
  title: string;
  location: string;
  date: string;
  thumbnailUrl?: string;
  opponentProfileUrl?: string;
  lastMessage?: string;
  unreadCount?: number;
};

export function ChatListItem({
  id,
  title,
  location,
  date,
  thumbnailUrl,
  opponentProfileUrl,
  lastMessage,
  unreadCount,
}: ChatListItemProps) {
  const { lang } = useLanguage();
  const t = chatMessages[lang];
  const showEmphasis = (unreadCount ?? 0) > 0;

  return (
    <Link
      href={{
        pathname: `/chat/${encodeURIComponent(id)}`,
        query: {
          title,
          addr: location,
          thumb: thumbnailUrl || undefined,
          opp: opponentProfileUrl || undefined,
        },
      }}
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
        <p
          className={`truncate text-base font-bold ${showEmphasis ? 'text-gray-900' : 'text-gray-600'}`}
        >
          {title}
        </p>
        {lastMessage && (
          <p
            className={`mt-1 truncate text-sm ${showEmphasis ? 'text-gray-600' : 'text-gray-400'}`}
          >
            {lastMessage}
          </p>
        )}
      </div>

      {/* 오른쪽 날짜 + 뱃지 (숫자 배지 제거, Dot만 표시) */}
      <div className="flex flex-col items-end gap-1 mt-1 mb-auto flex-shrink-0">
        <span className="text-xs text-gray-300">{date}</span>
        {showEmphasis ? <Dot className="text-primary" size={24} strokeWidth={8} /> : null}
      </div>
    </Link>
  );
}

export default ChatListItem;
