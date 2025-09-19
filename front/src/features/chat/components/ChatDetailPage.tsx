'use client';

import { useEffect, useState } from 'react';
import StayInfoCard from '@/features/chat/components/StayInfoCard';
import MessageItem, { type MessageItemModel } from '@/features/chat/components/MessageItem';
import InputBar from '@/features/chat/components/InputBar';
import { notifyFirebaseUnavailable } from '@/features/chat/api/toastHelpers';
import {
  ensureTestChat,
  subscribeTestChat,
  sendTestMessage,
} from '@/features/chat/api/chat.firestore';
import { getFirebaseInitError } from '@/lib/firebase/client';
import { useLanguage } from '@/features/language';
import { chatMessages } from '@/features/chat/locale';

interface ChatDetailPageProps {
  chatId: string;
}

const TEST_SENDER_UID = '123'; // 테스트용 내 사용자 UID (string)

// 화면 표시에 필요한 최소 데이터 모델
interface ChatDetailData {
  stay: {
    id: string;
    title: string;
    address: string;
    thumbnailUrl?: string;
  };
  messages: MessageItemModel[];
}

export function ChatDetailPage({ chatId }: ChatDetailPageProps) {
  const isTest = chatId === 'test';
  const initError = getFirebaseInitError();
  const { lang } = useLanguage();
  const t = chatMessages[lang];

  // Firebase 테스트 방 전용 상태
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
          ({ room, messages }) => {
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

              const period = hour24 < 12 ? t.am : t.pm;
              const hour12Raw = hour24 % 12;
              const hour12 = String(hour12Raw === 0 ? 12 : hour12Raw).padStart(2, '0');
              const timeText =
                lang === 'kor'
                  ? `${y}.${mo}.${d} ${period} ${hour12}:${mm}`
                  : `${mo}/${d}/${y} ${period} ${hour12}:${mm}`;

              return {
                id: m.id,
                content: m.content,
                isMine: m.senderUid === TEST_SENDER_UID,
                timestamp: showTime ? timeText : undefined,
              };
            });
            setTestData({
              stay: {
                id: String(room.stayId),
                title: '테스트',
                address: '',
              },
              messages: mapped,
            });
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
  }, [isTest, lang, t.am, t.pm]);

  useEffect(() => {
    if (!isTest) return;
    if (initError || testError) {
      notifyFirebaseUnavailable(lang);
    }
  }, [isTest, initError, testError, lang]);

  const displayData = testData;
  const loading = isTestLoading;

  const handleTranslate = (id: string) => {
    // 현재 표시 중인 메시지에서 원문을 찾아 언어 탐지
    const all = testData?.messages ?? [];
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
    void sendTestMessage(TEST_SENDER_UID, text.trim());
  };

  if (loading) {
    return <main className="flex flex-col w-full min-h-screen bg-white" />;
  }

  // 오류 시: 빈 화면만 표시 (토스트는 상단 effect에서 한 번만 노출)
  if (initError || testError) {
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
