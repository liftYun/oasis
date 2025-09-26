'use client';

import { useState, useMemo } from 'react';
import { useChatList } from '@/features/chat/hooks/useChatList';
import { ChatList } from '@/features/chat/components/ChatList';
import { useLanguage } from '@/features/language';
import { chatMessages } from '@/features/chat/locale';
import { Plus, Search } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export function ChatListPage() {
  const { data, isLoading } = useChatList();
  const { lang } = useLanguage();
  const t = chatMessages[lang];
  const router = useRouter();

  const [query, setQuery] = useState('');

  const handleAddChat = () => {
    toast.success('대화할 숙소를 먼저 선택해주세요!');
    router.push('/search');
  };

  // 검색 필터링
  const filteredChats = useMemo(() => {
    if (!data) return [];
    return data.filter((chat) => chat.title.toLowerCase().includes(query.toLowerCase()));
  }, [data, query]);

  const placeholders: Record<'kor' | 'eng', string> = {
    kor: '채팅방 제목 검색',
    eng: 'Search for chat room title',
  };

  return (
    <main className="relative flex flex-col w-full pt-10 pb-28">
      <h1 className="text-2xl font-semibold text-gray-600">{t.titleChat}</h1>

      <div className="mt-8 flex items-center w-full max-w-md rounded-full bg-gray-100 px-4 py-2 shadow-sm">
        <Search className="w-4 h-8 text-gray-500" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholders[lang]}
          className="ml-4 w-full bg-transparent outline-none text-sm text-gray-600 placeholder-gray-500 cursor-pointer"
        />
      </div>

      <div className="mt-6 min-h-screen">
        {isLoading ? (
          <div className="py-10 text-center text-gray-300">{t.loading}</div>
        ) : (
          <ChatList items={filteredChats} />
        )}
        <button
          onClick={handleAddChat}
          className="fixed bottom-28 right-6 w-14 h-14 flex items-center justify-center
                   rounded-full bg-gradient-to-r from-primary to-green text-white shadow-lg
                   hover:opacity-90 active:scale-95 transition"
        >
          <Plus size={28} />
        </button>
      </div>
    </main>
  );
}
