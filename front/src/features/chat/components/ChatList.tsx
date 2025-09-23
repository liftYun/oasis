// 채팅 리스트 컴포넌트
'use client';

import { ChatListItem } from '@/features/chat/components/ChatListItem';
import type { ChatSummary } from '@/features/chat';

type ChatListProps = {
  items: ChatSummary[];
};

export function ChatList({ items }: ChatListProps) {
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
        />
      ))}
    </div>
  );
}

export default ChatList;
