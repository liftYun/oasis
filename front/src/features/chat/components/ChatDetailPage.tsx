'use client';

import StayInfoCard from '@/features/chat/components/StayInfoCard';
import MessageItem from '@/features/chat/components/MessageItem';
import InputBar from '@/features/chat/components/InputBar';
import { useChatDetail } from '@/features/chat/hooks/useChatDetail';
import { sendChatMessage } from '@/features/chat/api/chat.firestore';
import { useAuthStore } from '@/stores/useAuthStores';
import { useLanguage } from '@/features/language';
import { notifySendFail } from '@/features/chat/api/toastHelpers';

interface ChatDetailPageProps {
  chatId: string;
}

export function ChatDetailPage({ chatId }: ChatDetailPageProps) {
  const { data, isLoading } = useChatDetail(chatId);
  const { uuid: myUid } = useAuthStore();
  const { lang } = useLanguage();

  const handleTranslate = (id: string) => {
    const text = data?.messages.find((m) => m.id === id)?.content ?? '';
    import('@/features/chat/utils/languageDetection').then(
      ({ detectLanguage, getTargetLanguage }) => {
        const lang = detectLanguage(text);
        const targetLang = getTargetLanguage(lang);
        console.log('[Translation Detect]', { id, lang, targetLang, text });
      }
    );
  };

  const handleSend = async (text: string) => {
    if (!text.trim() || !myUid) return;
    try {
      await sendChatMessage(chatId, myUid, text.trim());
    } catch (e) {
      if (process.env.NODE_ENV !== 'production') console.error(e);
      notifySendFail(lang);
    }
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
