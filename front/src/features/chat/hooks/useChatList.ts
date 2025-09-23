'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { subscribeMyChatRooms, type FirestoreRoom } from '@/features/chat/api/chat.firestore';
import { useAuthStore } from '@/stores/useAuthStores';
import { getChatList } from '@/services/chat.api';
import type { ChatListItem } from '@/services/chat.types';
import type { BaseResponse } from '@/services/stay.types';
import type { ChatSummary } from '@/features/chat';
import { useLanguage } from '@/features/language';
import { notifyFirebaseUnavailable } from '@/features/chat/api/toastHelpers';

type FirestoreRoomWithId = { id: string; data: FirestoreRoom };

function mapToSummary(
  rooms: FirestoreRoomWithId[],
  stayMap: Map<number, ChatListItem>,
  myUid: string
): ChatSummary[] {
  return rooms.map((r) => {
    const opponentUid = r.data.memberIds.find((u) => u !== myUid) ?? '';
    const stay = stayMap.get(r.data.stayId);
    const myUnread = r.data.unreadCounts?.[myUid] ?? 0;

    const updatedAt = r.data.updatedAt?.toDate?.();

    return {
      id: r.id,
      title: stay?.title ?? '',
      location: stay?.addr ?? '',
      thumbnailUrl: stay?.thumbnail ?? '',
      opponentProfileUrl: (r.data.participants?.[opponentUid]?.profileUrl || undefined) as
        | string
        | undefined,
      lastMessage: r.data.lastMessage ?? '',
      lastDate: (() => {
        const ts = updatedAt;
        if (!ts) return '';
        const y = String(ts.getFullYear()).slice(-2);
        const mo = String(ts.getMonth() + 1).padStart(2, '0');
        const d = String(ts.getDate()).padStart(2, '0');
        return `${y}.${mo}.${d}`;
      })(),
      unreadCount: myUnread,
      isUnread: myUnread > 0,
    } satisfies ChatSummary;
  });
}

export function useChatList() {
  const { uuid: myUid } = useAuthStore();
  const [rooms, setRooms] = useState<FirestoreRoomWithId[]>([]);
  const { lang } = useLanguage();

  // Firestore 실시간 구독: 내 UUID 기준
  useEffect(() => {
    if (!myUid) return;
    const unsub = subscribeMyChatRooms(
      myUid,
      (list) => setRooms(list),
      (error) => {
        if (process.env.NODE_ENV !== 'production') {
          console.error('Failed to subscribe to chat rooms:', error);
        }
        notifyFirebaseUnavailable(lang);
      }
    );
    return () => unsub();
  }, [myUid, lang]);

  // stayId 목록 추출 (중복 제거)
  const stayIds = useMemo(() => {
    const ids = rooms.map((r) => r.data.stayId);
    return Array.from(new Set(ids));
  }, [rooms]);

  // 백엔드 조인: 숙소 썸네일/이름/주소
  const { data, isLoading } = useQuery({
    queryKey: ['chat', 'stayList', stayIds],
    queryFn: async () => {
      if (stayIds.length === 0) return [] as ChatListItem[];
      const res = await getChatList(stayIds);
      return (res.result ?? []) as ChatListItem[];
    },
    enabled: stayIds.length > 0,
  });

  const stayMap = useMemo(() => {
    const m = new Map<number, ChatListItem>();
    for (const item of data ?? []) m.set(item.stayId, item);
    return m;
  }, [data]);

  const summaries = useMemo(() => {
    if (!myUid) return [] as ChatSummary[];
    return mapToSummary(rooms, stayMap, myUid);
  }, [rooms, stayMap, myUid]);

  return { data: summaries, isLoading };
}
