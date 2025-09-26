'use client';

import { useEffect, useMemo, useState } from 'react';
import type { MessageItemModel } from '@/features/chat/components/MessageItem';
import {
  subscribeChatMessages,
  subscribeChatRoom,
  markChatAsRead,
  type FirestoreRoom,
} from '@/features/chat/api/chat.firestore';
import { enterChatRoom, exitChatRoom } from '@/features/chat/api/presence.firestore';
import { useAuthStore } from '@/stores/useAuthStores';
import { useLanguage } from '@/features/language';
import { chatMessages } from '@/features/chat/locale';
import { notifyFirebaseUnavailable } from '@/features/chat/api/toastHelpers';

interface StayInfo {
  id: string;
  title: string;
  address: string;
  thumbnailUrl?: string;
  opponentProfileUrl?: string | null;
}

export interface ChatDetailData {
  stay: StayInfo;
  messages: MessageItemModel[];
}

export function useChatDetail(chatId: string) {
  const { uuid: myUid } = useAuthStore();
  const [room, setRoom] = useState<{ id: string; data: FirestoreRoom } | null>(null);
  const [messages, setMessages] = useState<MessageItemModel[]>([]);
  const [header, setHeader] = useState<StayInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { lang } = useLanguage();
  const t = chatMessages[lang];

  // 방 메타 구독
  useEffect(() => {
    if (!chatId) return;
    const unsub = subscribeChatRoom(
      chatId,
      (r) => setRoom(r),
      (e) => {
        if (process.env.NODE_ENV !== 'production') console.error(e);
        setError('unavailable');
        notifyFirebaseUnavailable(lang);
      }
    );
    return () => unsub();
  }, [chatId]);

  // 메시지 구독
  useEffect(() => {
    if (!chatId) return;
    const unsub = subscribeChatMessages(
      chatId,
      (list) => {
        setMessages(
          list.map((m, idx, arr) => {
            const created = m.data.createdAt?.toDate?.();
            // 같은 분에서 첫 메시지에만 타임스탬프 텍스트 노출
            const prevCreated = idx > 0 ? arr[idx - 1].data.createdAt?.toDate?.() : undefined;
            const showTime = (() => {
              if (!created) return '';
              if (!prevCreated) return formatTs(created, t);
              const sameMinute =
                created.getFullYear() === prevCreated.getFullYear() &&
                created.getMonth() === prevCreated.getMonth() &&
                created.getDate() === prevCreated.getDate() &&
                created.getHours() === prevCreated.getHours() &&
                created.getMinutes() === prevCreated.getMinutes();
              return sameMinute ? '' : formatTs(created, t);
            })();
            return {
              id: m.id,
              content: m.data.content,
              isMine: !!myUid && m.data.senderUid === myUid,
              timestamp: showTime,
            } satisfies MessageItemModel;
          })
        );
      },
      (e) => {
        if (process.env.NODE_ENV !== 'production') console.error(e);
        setError('unavailable');
        notifyFirebaseUnavailable(lang);
      }
    );
    return () => unsub();
  }, [chatId, myUid, t]);

  // 방 입장/퇴장 + 읽음 처리 (입장/이탈 모두에서 보정)
  useEffect(() => {
    if (!chatId || !myUid) return;
    const currentMyUid = myUid;
    const currentChatId = chatId;

    // 1) 입장 시 presence 등록 및 읽음 처리
    const enterPromise = (async () => {
      try {
        await enterChatRoom(currentChatId, currentMyUid);
        await markChatAsRead(currentChatId, currentMyUid);
      } catch (e) {
        if (process.env.NODE_ENV !== 'production') console.warn('presence/read init failed', e);
      }
    })();

    // 2) 조기 정리를 위한 베스트 에포트 클린업 (중복 호출 방지)
    let cleaned = false;
    const performBestEffortCleanup = () => {
      if (cleaned || !currentMyUid) return;
      cleaned = true;
      enterPromise
        .catch(() => {})
        .finally(async () => {
          // 순서 보장: 읽음 처리 후 presence 제거
          try {
            await markChatAsRead(currentChatId, currentMyUid);
          } catch {}
          try {
            await exitChatRoom(currentChatId, currentMyUid);
          } catch {}
        });
    };

    // 3) 페이지 가려짐/페이지 종료 시 가능한 일찍 정리 시도
    const onVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        performBestEffortCleanup();
      }
    };
    const onPageHide = () => {
      performBestEffortCleanup();
    };
    const onBeforeUnload = () => {
      performBestEffortCleanup();
    };

    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', onVisibilityChange);
    }
    if (typeof window !== 'undefined') {
      window.addEventListener('pagehide', onPageHide);
      window.addEventListener('beforeunload', onBeforeUnload);
    }

    // 4) 리액트 언마운트 시에도 최종 보정
    return () => {
      if (typeof document !== 'undefined') {
        document.removeEventListener('visibilitychange', onVisibilityChange);
      }
      if (typeof window !== 'undefined') {
        window.removeEventListener('pagehide', onPageHide);
        window.removeEventListener('beforeunload', onBeforeUnload);
      }
      performBestEffortCleanup();
    };
  }, [chatId, myUid]);

  // 라우터 쿼리에서 리스트 데이터 수신 (제목/주소/썸네일/상대썸네일)
  useEffect(() => {
    try {
      const url = typeof window !== 'undefined' ? new URL(window.location.href) : null;
      if (!url) return;
      const q = url.searchParams;
      const title = q.get('title') ?? '';
      const address = q.get('addr') ?? '';
      const thumb = q.get('thumb') ?? '';
      const opp = q.get('opp') ?? '';
      setHeader({
        id: String(room?.data.stayId ?? ''),
        title,
        address,
        thumbnailUrl: thumb && thumb.length > 0 ? thumb : undefined,
        opponentProfileUrl: opp && opp.length > 0 ? opp : undefined,
      });
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        console.error('Failed to parse URL parameters:', error);
      }
    }
  }, [room?.data.stayId]);
  const detail: ChatDetailData | undefined = useMemo(() => {
    if (!room) return undefined;
    const stayInfo: StayInfo = header ?? {
      id: String(room.data.stayId),
      title: '',
      address: '',
    };
    return { stay: stayInfo, messages };
  }, [room, messages, header]);

  return { data: detail, isLoading: !detail && !error, error };
}

function formatTs(date: Date, t: { am: string; pm: string }): string {
  const hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const ampm = hours < 12 ? t.am : t.pm;
  const h12 = hours % 12 === 0 ? 12 : hours % 12;
  const y = String(date.getFullYear()).slice(-2);
  const mo = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}.${mo}.${d} ${ampm} ${h12}:${minutes}`;
}
