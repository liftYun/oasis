'use client';

import { getDb } from '@/lib/firebase/client';
import { collection, onSnapshot, query, where, orderBy, type Firestore } from 'firebase/firestore';

interface FirestoreRoom {
  // 참여자 UUID 쿼리용
  memberIds: string[]; // [uidA, uidB]
  // 불변 프로필 URL(요구사항: 변경되지 않는 값)
  participants: Record<string, { profileUrl: string }>;
  // 백엔드 조회용
  stayId: number;
  // 메타
  lastMessage?: string;
  createdAt?: { toDate(): Date };
  updatedAt?: { toDate(): Date };
}

// 실제 구독: 내 UUID 기준으로 속한 채팅방 목록을 실시간 수신
export function subscribeMyChatRooms(
  myUid: string,
  cb: (rooms: Array<{ id: string; data: FirestoreRoom }>) => void,
  onError?: (error: unknown) => void
) {
  const db = getDb();
  if (!db) {
    onError?.(new Error('Firestore is not configured'));
    return () => {};
  }
  const roomsRef = collection(db, 'chats');
  const q = query(
    roomsRef,
    where('memberIds', 'array-contains', myUid),
    orderBy('updatedAt', 'desc')
  );
  const unsub = onSnapshot(
    q,
    (snap) => {
      const list = snap.docs.map((d) => ({ id: d.id, data: d.data() as FirestoreRoom }));
      cb(list);
    },
    onError
  );
  return unsub;
}

export type { FirestoreRoom };
