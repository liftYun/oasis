'use client';

import Image from 'next/image';
import Link from 'next/link';
import StayImage from '@/assets/images/stay_example.png';
import { useLanguage } from '@/features/language';
import { chatMessages } from '@/features/chat/locale';
import { ChatUserThumbnail } from '@/components/atoms/ChatUserThumbnail';
import { useChatStore } from '@/stores/useChatStore';
import { useEffect } from 'react';

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

  const { addUnread, removeUnread } = useChatStore();

  useEffect(() => {
    if (unreadCount && unreadCount > 0) {
      addUnread(id, unreadCount);
    }
    return () => {
      removeUnread(id);
    };
  }, [id, unreadCount, addUnread, removeUnread]);

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
      className="flex items-center gap-4 px-5 py-7 hover:bg-gray-50"
    >
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
          className={`truncate text-base font-bold ${
            showEmphasis ? 'text-gray-900' : 'text-gray-600'
          }`}
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

      <div className="flex flex-col items-end gap-1 mt-1 mb-auto flex-shrink-0">
        <span className="text-xs text-gray-300">{date}</span>

        <div className="relative mt-2">
          {showEmphasis && (
            <span
              className="flex h-6 min-w-[1.5rem] items-center justify-center
                 rounded-full bg-gradient-to-r from-primary to-green text-white
                 text-[12px] font-medium px-2"
            >
              {unreadCount && unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

export default ChatListItem;
