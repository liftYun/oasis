'use client';

import { getDb } from '@/lib/firebase/client';
import {
  collection,
  onSnapshot,
  query,
  where,
  orderBy,
  doc,
  addDoc,
  getDocs,
  updateDoc,
  serverTimestamp,
  type Firestore,
} from 'firebase/firestore';

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

interface FirestoreMessage {
  content: string;
  senderUid: string;
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

// 특정 채팅방 메타 구독 (stayId, participants, memberIds 등)
export function subscribeChatRoom(
  chatId: string,
  cb: (room: { id: string; data: FirestoreRoom } | null) => void,
  onError?: (error: unknown) => void
) {
  const db = getDb();
  if (!db) {
    onError?.(new Error('Firestore is not configured'));
    return () => {};
  }
  const ref = doc(db, 'chats', chatId);
  const unsub = onSnapshot(
    ref,
    (snap) => {
      if (!snap.exists()) {
        cb(null);
        return;
      }
      cb({ id: snap.id, data: snap.data() as FirestoreRoom });
    },
    onError
  );
  return unsub;
}

// 특정 채팅방 메시지 구독 (오름차순)
export function subscribeChatMessages(
  chatId: string,
  cb: (messages: Array<{ id: string; data: FirestoreMessage }>) => void,
  onError?: (error: unknown) => void
) {
  const db = getDb();
  if (!db) {
    onError?.(new Error('Firestore is not configured'));
    return () => {};
  }
  const ref = collection(db, 'chats', chatId, 'messages');
  const q = query(ref, orderBy('createdAt', 'asc'));
  const unsub = onSnapshot(
    q,
    (snap) => {
      const list = snap.docs.map((d) => ({ id: d.id, data: d.data() as FirestoreMessage }));
      cb(list);
    },
    onError
  );
  return unsub;
}

export type { FirestoreRoom };
export type { FirestoreMessage };

// 메시지 전송: messages 서브컬렉션에 추가하고, 상위 방 메타 갱신
export async function sendChatMessage(
  chatId: string,
  senderUid: string,
  content: string
): Promise<void> {
  const db = getDb();
  if (!db) throw new Error('Firestore is not configured');
  if (!content.trim()) return;

  const trimmed = content.trim();
  if (trimmed.length > 500) {
    throw new Error('MESSAGE_TOO_LONG');
  }
  const messagesRef = collection(db, 'chats', chatId, 'messages');
  await addDoc(messagesRef, {
    content: trimmed,
    senderUid,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  const roomRef = doc(db, 'chats', chatId);
  await updateDoc(roomRef, {
    lastMessage: trimmed,
    updatedAt: serverTimestamp(),
  });
}

// 기존 채팅방 조회: 내 UUID + 상대 UUID + 숙소 ID 조합으로 단일 방 확인
export async function findExistingChatRoom(
  myUid: string,
  hostUid: string,
  stayId: number
): Promise<string | null> {
  const db = getDb();
  if (!db) throw new Error('Firestore is not configured');

  const roomsRef = collection(db, 'chats');
  const q = query(
    roomsRef,
    where('memberIds', 'array-contains', myUid),
    where('stayId', '==', stayId)
  );
  const snap = await getDocs(q);
  for (const d of snap.docs) {
    const data = d.data() as FirestoreRoom;
    if (Array.isArray(data.memberIds) && data.memberIds.includes(hostUid)) {
      return d.id;
    }
  }
  return null;
}

// 채팅방 생성: 필수 필드 저장 (memberIds, participants, stayId, createdAt/updatedAt)
export async function createChatRoom(params: {
  myUid: string;
  myProfileUrl?: string | null;
  hostUid: string;
  hostProfileUrl?: string | null;
  stayId: number;
}): Promise<string> {
  const { myUid, myProfileUrl, hostUid, hostProfileUrl, stayId } = params;
  const db = getDb();
  if (!db) throw new Error('Firestore is not configured');

  const roomsRef = collection(db, 'chats');
  const docRef = await addDoc(roomsRef, {
    memberIds: [myUid, hostUid],
    participants: {
      [myUid]: { profileUrl: myProfileUrl ?? '' },
      [hostUid]: { profileUrl: hostProfileUrl ?? '' },
    } as Record<string, { profileUrl: string }>,
    stayId,
    lastMessage: '',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}
