'use client';

import { useEffect, useMemo, useState } from 'react';
import type { MessageItemModel } from '@/features/chat/components/MessageItem';
import {
  subscribeChatMessages,
  subscribeChatRoom,
  type FirestoreRoom,
} from '@/features/chat/api/chat.firestore';
import { useAuthStore } from '@/stores/useAuthStores';
import { useLanguage } from '@/features/language';
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
              if (!prevCreated) return formatTs(created);
              const sameMinute =
                created.getFullYear() === prevCreated.getFullYear() &&
                created.getMonth() === prevCreated.getMonth() &&
                created.getDate() === prevCreated.getDate() &&
                created.getHours() === prevCreated.getHours() &&
                created.getMinutes() === prevCreated.getMinutes();
              return sameMinute ? '' : formatTs(created);
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

function formatTs(date: Date): string {
  const hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const ampm = hours < 12 ? '오전' : '오후';
  const h12 = hours % 12 === 0 ? 12 : hours % 12;
  const y = String(date.getFullYear()).slice(-2);
  const mo = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}.${mo}.${d} ${ampm} ${h12}:${minutes}`;
}
