'use client';

import { ChatListItem } from '@/features/chat/components/ChatListItem';
import type { ChatSummary } from '@/features/chat';
import { Lottie } from '@/components/atoms/Lottie';
import { useLanguage } from '@/features/language';
import { chatMessages } from '@/features/chat/locale';

type ChatListProps = {
  items: ChatSummary[];
};

export function ChatList({ items }: ChatListProps) {
  const { lang } = useLanguage();
  const t = chatMessages[lang];

  if (items.length === 0) {
    return (
      <div className="flex flex-col flex-1 items-center justify-center p-4 pb-[450px] min-h-screen">
        <Lottie src="/lotties/empty.json" className="w-100 h-40" />
        <p className="mt-4 text-center text-gray-500">{t.emptyTitle}</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-200">
      {items.map((c) => (
        <ChatListItem
          key={c.id}
          id={c.id}
          title={c.title}
          location={c.location}
          date={c.lastDate}
          thumbnailUrl={c.thumbnailUrl}
          opponentProfileUrl={c.opponentProfileUrl}
          lastMessage={c.lastMessage}
          unreadCount={c.unreadCount}
        />
      ))}
    </div>
  );
}

export default ChatList;
