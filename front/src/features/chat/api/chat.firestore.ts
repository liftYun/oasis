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
} from 'firebase/firestore';

// 타입 정의로 any 제거
interface FirestoreRoom {
  stay: {
    id: string;
    title: string;
    address: string;
    thumbnailUrl?: string;
  };
}

interface FirestoreMessage {
  content: string;
  senderId: number;
  createdAt?: { toDate(): Date };
}

const DEFAULT_TEST_STAY: FirestoreRoom['stay'] = {
  id: 'stay-123',
  title: '광안 바이브',
  address: '부산 수영구 민락수변로 7 6층 601호',
  thumbnailUrl: '/images/stay_example.png',
};

// 테스트 채팅방 구독: chats/test + chats/test/messages
export function subscribeTestChat(
  cb: (data: {
    stay: { id: string; title: string; address: string; thumbnailUrl?: string };
    messages: Array<{ id: string; content: string; senderId: number; createdAtMs: number }>;
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

  let currentStay = DEFAULT_TEST_STAY;
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
      currentStay = rawRoom?.stay ?? DEFAULT_TEST_STAY;
      cb({ stay: currentStay, messages: currentMessages });
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
          senderId: m.senderId,
          createdAtMs: ms,
        };
      });
      cb({ stay: currentStay, messages: currentMessages });
    },
    onError
  );

  return () => {
    unsubRoom();
    unsubMsgs();
  };
}

export async function sendTestMessage(senderId: number, content: string) {
  const db = getDb();
  if (!db) {
    throw new Error('Firestore is not configured');
  }
  try {
    const msgsRef = collection(db, 'chats', 'test', 'messages');
    await runTransaction(db, async (transaction) => {
      const newMsgRef = doc(msgsRef);
      transaction.set(newMsgRef, { senderId, content, createdAt: serverTimestamp() });
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
      participantIds: [123, 456],
      stay: DEFAULT_TEST_STAY,
      lastMessage: '',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }
}
