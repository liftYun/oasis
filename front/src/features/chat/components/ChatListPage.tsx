'use client';

import { useEffect } from 'react';
import { useChatList } from '@/features/chat/hooks/useChatList';
import { ChatList } from '@/features/chat/components/ChatList';
import { useLanguage } from '@/features/language';
import { chatMessages } from '@/features/chat/locale';
import { useAuthStore } from '@/stores/useAuthStores';

export function ChatListPage() {
  const { data, isLoading } = useChatList();
  const { lang } = useLanguage();
  const t = chatMessages[lang];
  const { uuid, initialized } = useAuthStore();

  useEffect(() => {
    if (!initialized) return;
    if (uuid) {
      console.log('[chat] current user uuid:', uuid);
    } else {
      console.log('[chat] uuid: 없음');
    }
  }, [initialized, uuid]);

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
