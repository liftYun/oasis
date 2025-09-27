'use client';

import StayInfoCard from '@/features/chat/components/StayInfoCard';
import MessageItem from '@/features/chat/components/MessageItem';
import InputBar from '@/features/chat/components/InputBar';
import { useChatDetail } from '@/features/chat/hooks/useChatDetail';
import { sendChatMessage } from '@/features/chat/api/chat.firestore';
import { useAuthStore } from '@/stores/useAuthStores';
import { useLanguage } from '@/features/language';
import { notifySendFail, notifyTooLong } from '@/features/chat/api/toastHelpers';
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { translateMessage } from '@/services/chat.api';
import ScrollToBottomButton from '@/features/chat/components/ScrollToBottomButton';
import { Lottie } from '@/components/atoms/Lottie';
import { chatMessages } from '@/features/chat/locale';

interface ChatDetailPageProps {
  chatId: string;
}

export function ChatDetailPage({ chatId }: ChatDetailPageProps) {
  const { data, isLoading } = useChatDetail(chatId);
  const { uuid: myUid } = useAuthStore();
  const { lang } = useLanguage();
  const t = chatMessages[lang];
  const [translations, setTranslations] = useState<Record<string, string>>({});
  const [showOriginal, setShowOriginal] = useState<Record<string, boolean>>({});
  const storageKey = useMemo(() => `chat:translated:${chatId}`, [chatId]);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const didInitialScrollRef = useRef(false);
  const contentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved) as Record<string, string>;
        setTranslations(parsed);
      }
    } catch {}
  }, [storageKey]);

  useEffect(() => {
    const clear = () => sessionStorage.removeItem(storageKey);
    window.addEventListener('beforeunload', clear);
    return () => {
      window.removeEventListener('beforeunload', clear);
      clear();
    };
  }, [storageKey]);

  // 채팅방 진입 시 최초 한 번, 최신 메시지(하단)로 즉시 스크롤 (이전 단계로 원복)
  useLayoutEffect(() => {
    if (!data || didInitialScrollRef.current) return;
    const scrollToBottom = () =>
      bottomRef.current?.scrollIntoView({ behavior: 'auto', block: 'end' });
    bottomRef.current?.scrollIntoView({ behavior: 'auto', block: 'end' });

    scrollToBottom();
    requestAnimationFrame(() => {
      scrollToBottom();
    });
    didInitialScrollRef.current = true;
  }, [data?.messages?.length, data]);

  // 채팅방 이동 시 초기 스크롤 상태 초기화
  useEffect(() => {
    didInitialScrollRef.current = false;
  }, [chatId]);

  const handleTranslate = async (id: string) => {
    // 이미 번역된 내용이 있으면 원문/번역문 토글
    if (translations[id]) {
      setShowOriginal((prev) => ({ ...prev, [id]: !prev[id] }));
      return;
    }
    const original = data?.messages.find((m) => m.id === id)?.content ?? '';
    if (!original) return;
    const { detectLanguage, getTargetLanguage } = await import(
      '@/features/chat/utils/languageDetection'
    );
    const detected = detectLanguage(original); // 'ko' | 'en' | 'unknown'
    const target = getTargetLanguage(detected) ?? 'en'; // API: 'ko' | 'en'
    const source = detected === 'ko' ? 'ko' : detected === 'en' ? 'en' : undefined; // 명세 준수
    try {
      const res = await translateMessage(
        source ? { text: original, target, source } : { text: original, target }
      );
      const translatedText = res.text;
      setTranslations((prev) => {
        const next = { ...prev, [id]: translatedText };
        sessionStorage.setItem(storageKey, JSON.stringify(next));
        return next;
      });
      setShowOriginal((prev) => ({ ...prev, [id]: false }));
    } catch (e) {
      if (process.env.NODE_ENV !== 'production') console.error('번역 실패:', e);
    }
  };

  const handleSend = async (text: string) => {
    const msg = text.trim();
    if (!msg || !myUid) return;
    if (msg.length > 500) {
      notifyTooLong(lang);
      return;
    }
    try {
      await sendChatMessage(chatId, myUid, msg);
    } catch (e) {
      if (e instanceof Error && e.message === 'MESSAGE_TOO_LONG') {
        notifyTooLong(lang);
        return;
      }
      if (process.env.NODE_ENV !== 'production') console.error(e);
      notifySendFail(lang);
    }
  };

  if (isLoading || !data) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center p-4 pb-56 bg-blue-50">
        <Lottie src="/lotties/spinner.json" className="w-20 h-20" />
        <p className="mt-2 text-center text-gray-500">{t.loading}</p>
      </div>
    );
  }

  return (
    <>
      <section className="px-4 sticky top-0 z-10 bg-blue-50">
        <StayInfoCard stay={data.stay} />
      </section>
      <main className="flex flex-col w-full min-h-screen bg-blue-50">
        <section className="flex-1 px-4 pt-6 pb-[calc(env(safe-area-inset-bottom)+100px)]">
          {data.messages.map((m) => {
            const override = translations[m.id];
            const hasTranslation = typeof override === 'string' && override.length > 0;
            const isShowingOriginal = showOriginal[m.id] === true;
            const display = hasTranslation && !isShowingOriginal ? { ...m, content: override } : m;
            return (
              <MessageItem
                key={m.id}
                message={display}
                translated={hasTranslation && !isShowingOriginal}
                onClickTranslate={handleTranslate}
              />
            );
          })}
          <div ref={bottomRef} className="scroll-mb-[120px]" />
        </section>

        <InputBar onSend={handleSend} />
        <ScrollToBottomButton anchorRef={bottomRef} />
      </main>
    </>
  );
}
