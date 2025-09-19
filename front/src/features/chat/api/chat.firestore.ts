'use client';

import { getDb } from '@/lib/firebase/client';
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  setDoc,
  where,
  type Firestore,
  type QuerySnapshot,
  type DocumentData,
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
  senderUid: string; // Firebase Auth 미사용 시에도 필드로만 저장
  createdAt?: { toDate(): Date };
}

const DEFAULT_TEST_ROOM: FirestoreRoom = {
  memberIds: ['123', '456'],
  participants: {
    '123': { profileUrl: '/images/stay_example.png' },
    '456': { profileUrl: '/images/stay_example.png' },
  },
  stayId: 1201,
  lastMessage: '',
};

// 테스트 채팅방 구독: chats/test + chats/test/messages
export function subscribeTestChat(
  cb: (data: {
    room: FirestoreRoom;
    messages: Array<{ id: string; content: string; senderUid: string; createdAtMs: number }>;
  }) => void,
  onError?: (error: unknown) => void
) {
  const db = getDb();
  if (!db) {
    const err = new Error('Firestore is not configured');
    onError?.(err);
    return () => {};
  }

  const roomRef = doc(db, 'chats', 'test');
  const msgsRef = collection(db, 'chats', 'test', 'messages');

  let currentRoom: FirestoreRoom = DEFAULT_TEST_ROOM;
  let currentMessages: Array<{
    id: string;
    content: string;
    senderId: number;
    createdAtMs: number;
  }> = [];

  const unsubRoom = onSnapshot(
    roomRef,
    (snap) => {
      const rawRoom = snap.data() as FirestoreRoom | undefined;
      currentRoom = rawRoom ?? DEFAULT_TEST_ROOM;
      cb({ room: currentRoom, messages: currentMessages });
    },
    onError
  );

  const unsubMsgs = onSnapshot(
    query(msgsRef, orderBy('createdAt', 'asc')),
    (snap) => {
      currentMessages = snap.docs.map((d) => {
        const m = d.data() as FirestoreMessage;
        const ms = m.createdAt?.toDate ? m.createdAt.toDate().getTime() : Date.now();
        return {
          id: d.id,
          content: m.content,
          senderUid: m.senderUid,
          createdAtMs: ms,
        };
      });
      cb({ room: currentRoom, messages: currentMessages });
    },
    onError
  );

  return () => {
    unsubRoom();
    unsubMsgs();
  };
}

export async function sendTestMessage(senderUid: string, content: string) {
  const db = getDb();
  if (!db) {
    throw new Error('Firestore is not configured');
  }
  try {
    const msgsRef = collection(db, 'chats', 'test', 'messages');
    await runTransaction(db, async (transaction) => {
      const newMsgRef = doc(msgsRef);
      transaction.set(newMsgRef, { senderUid, content, createdAt: serverTimestamp() });
      transaction.set(
        doc(db, 'chats', 'test'),
        {
          lastMessage: content,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
    });
  } catch (error) {
    console.error('Failed to send test message:', error);
    throw error;
  }
}

// 필요 시 테스트 채팅방을 생성/초기화
export async function ensureTestChat() {
  const db = getDb();
  if (!db) {
    return;
  }
  const ref = doc(db, 'chats', 'test');
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, {
      memberIds: DEFAULT_TEST_ROOM.memberIds,
      participants: DEFAULT_TEST_ROOM.participants,
      stayId: DEFAULT_TEST_ROOM.stayId,
      lastMessage: DEFAULT_TEST_ROOM.lastMessage,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }
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
