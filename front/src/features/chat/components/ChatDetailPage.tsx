'use client';

import { useEffect, useState } from 'react';
import StayInfoCard from '@/features/chat/components/StayInfoCard';
import MessageItem, { type MessageItemModel } from '@/features/chat/components/MessageItem';
import InputBar from '@/features/chat/components/InputBar';
import { useChatDetail, type ChatDetailData } from '@/features/chat/hooks/useChatDetail';
import { notifyFirebaseUnavailable } from '@/features/chat/api/toastHelpers';
import {
  ensureTestChat,
  subscribeTestChat,
  sendTestMessage,
} from '@/features/chat/api/chat.firestore';
import { getFirebaseInitError } from '@/lib/firebase/client';

interface ChatDetailPageProps {
  chatId: string;
}

const TEST_SENDER_ID = 123; // 테스트용 내 사용자 ID

export function ChatDetailPage({ chatId }: ChatDetailPageProps) {
  const isTest = chatId === 'test';
  const initError = getFirebaseInitError();

  // 기존 더미/실제 API 훅 (테스트가 아닐 때 사용)
  const { data, isLoading } = useChatDetail(chatId);

  // 테스트 방 전용 상태
  const [testData, setTestData] = useState<ChatDetailData | null>(null);
  const [isTestLoading, setIsTestLoading] = useState<boolean>(isTest);
  const [testError, setTestError] = useState<string | null>(null);

  useEffect(() => {
    if (!isTest) return;

    let unsubscribe: (() => void) | undefined;
    (async () => {
      try {
        await ensureTestChat();
        unsubscribe = subscribeTestChat(
          ({ stay, messages }) => {
            // 분 단위로 묶어서 같은 분의 첫 메시지에만 타임스탬프를 붙인다
            let lastMinuteKey: string | null = null;
            const mapped: MessageItemModel[] = messages.map((m) => {
              const date = new Date(m.createdAtMs);
              const y = String(date.getFullYear()).slice(-2);
              const mo = String(date.getMonth() + 1).padStart(2, '0');
              const d = String(date.getDate()).padStart(2, '0');
              const hour24 = date.getHours();
              const mm = String(date.getMinutes()).padStart(2, '0');
              const minuteKey = `${y}-${mo}-${d} ${hour24}:${mm}`; // 그룹핑용 키(24h)
              const showTime = lastMinuteKey !== minuteKey;
              if (showTime) lastMinuteKey = minuteKey;

              const period = hour24 < 12 ? '오전' : '오후';
              const hour12Raw = hour24 % 12;
              const hour12 = String(hour12Raw === 0 ? 12 : hour12Raw).padStart(2, '0');
              const timeText = `${y}.${mo}.${d} ${period} ${hour12}:${mm}`;

              return {
                id: m.id,
                content: m.content,
                isMine: m.senderId === TEST_SENDER_ID,
                timestamp: showTime ? timeText : undefined,
              };
            });
            setTestData({ stay, messages: mapped });
            setIsTestLoading(false);
          },
          (err) => {
            setTestError(err instanceof Error ? err.message : '알 수 없는 오류');
            setIsTestLoading(false);
          }
        );
      } catch (e) {
        setTestError(e instanceof Error ? e.message : '알 수 없는 오류');
        setIsTestLoading(false);
      }
    })();

    return () => unsubscribe?.();
  }, [isTest]);

  useEffect(() => {
    if (!isTest) return;
    if (initError || testError) {
      notifyFirebaseUnavailable();
    }
  }, [isTest, initError, testError]);

  const displayData = isTest ? testData : data;
  const loading = isTest ? isTestLoading : isLoading;

  const handleTranslate = (id: string) => {
    // 현재 표시 중인 메시지에서 원문을 찾아 언어 탐지
    const all = (isTest ? testData?.messages : data?.messages) ?? [];
    const target = all.find((m) => m.id === id);
    const text = target?.content ?? '';
    import('@/features/chat/utils/languageDetection').then(
      ({ detectLanguage, getTargetLanguage }) => {
        const lang = detectLanguage(text);
        const targetLang = getTargetLanguage(lang);
        console.log('[Translation Detect]', { id, lang, targetLang, text });
      }
    );
  };

  const handleSend = (text: string) => {
    if (!text.trim()) return;
    if (isTest) {
      void sendTestMessage(TEST_SENDER_ID, text.trim());
      return;
    }
    console.log('send message:', text.trim(), 'in chat:', chatId);
  };

  if (loading) {
    return <main className="flex flex-col w-full min-h-screen bg-white" />;
  }

  // 오류 시: 빈 화면만 표시 (토스트는 상단 effect에서 한 번만 노출)
  if (isTest && (initError || testError)) {
    return <main className="flex flex-col w-full min-h-screen bg-white" />;
  }

  if (!displayData) {
    return <main className="flex flex-col w-full min-h-screen bg-white" />;
  }

  return (
    <main className="flex flex-col w-full min-h-screen bg-white">
      <section className="px-4">
        <StayInfoCard stay={displayData.stay} />
      </section>

      <section className="flex-1 px-4 pt-6 pb-[calc(env(safe-area-inset-bottom)+88px)]">
        {displayData.messages.map((m) => (
          <MessageItem key={m.id} message={m} onClickTranslate={handleTranslate} />
        ))}
      </section>

      <InputBar onSend={handleSend} />
    </main>
  );
}
