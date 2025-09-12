'use client';

import { useChatList } from '@/features/chat/hooks/useChatList';
import { ChatList } from '@/components/organisms/ChatList';

export function ChatListPage() {
  const { data, isLoading } = useChatList();

  return (
    <main className="flex flex-col w-full pt-10 pb-28">
      <h1 className="text-2xl font-extrabold text-gray-600 mt-2">채팅</h1>

      <div className="mt-6">
        {isLoading ? (
          <div className="py-10 text-center text-gray-300">불러오는 중...</div>
        ) : (
          <ChatList items={data ?? []} />
        )}
      </div>
    </main>
  );
}
