'use client';

import { useChatList } from '@/features/chat/hooks/useChatList';
import { ChatList } from '@/features/chat/components/ChatList';
import { useLanguage } from '@/features/language';
import { chatMessages } from '@/features/chat/locale';

export function ChatListPage() {
  const { data, isLoading } = useChatList();
  const { lang } = useLanguage();
  const t = chatMessages[lang];

  return (
    <main className="flex flex-col w-full pt-10 pb-28">
      <h1 className="text-2xl font-extrabold text-gray-600 mt-2">{t.titleChat}</h1>

      <div className="mt-6">
        {isLoading ? (
          <div className="py-10 text-center text-gray-300">{t.loading}</div>
        ) : (
          <ChatList items={data ?? []} />
        )}
      </div>
    </main>
  );
}
