'use client';

import StayInfoCard from '@/features/chat/components/StayInfoCard';
import MessageItem from '@/features/chat/components/MessageItem';
import InputBar from '@/features/chat/components/InputBar';
import { useChatDetail } from '@/features/chat/hooks/useChatDetail';

interface ChatDetailPageProps {
  chatId: string;
}

export function ChatDetailPage({ chatId }: ChatDetailPageProps) {
  const { data, isLoading } = useChatDetail(chatId);

  const handleTranslate = (id: string) => {
    console.log('translate message id:', id);
  };

  const handleSend = (text: string) => {
    console.log('send message:', text, 'in chat:', chatId);
  };

  if (isLoading || !data) {
    return <main className="flex flex-col w-full min-h-screen bg-white" />;
  }

  return (
    <main className="flex flex-col w-full min-h-screen bg-white">
      <section className="px-4">
        <StayInfoCard stay={data.stay} />
      </section>

      <section className="flex-1 px-4 pt-6 pb-[calc(env(safe-area-inset-bottom)+88px)]">
        {data.messages.map((m) => (
          <MessageItem key={m.id} message={m} onClickTranslate={handleTranslate} />
        ))}
      </section>

      <InputBar onSend={handleSend} />
    </main>
  );
}
