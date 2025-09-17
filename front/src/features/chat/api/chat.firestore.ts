'use client';

import { db } from '@/lib/firebase/client';
import {
  addDoc,
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
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
  onError?: (error: unknown) => void,
) {
  const roomRef = doc(db, 'chats', 'test');
  const msgsRef = collection(db, 'chats', 'test', 'messages');

  const unsubMsgs = onSnapshot(
    query(msgsRef, orderBy('createdAt', 'asc')),
    async (snap) => {
      const roomSnap = await getDoc(roomRef);
      const rawRoom = roomSnap.data() as FirestoreRoom | undefined;
      const r: FirestoreRoom = rawRoom ?? { stay: DEFAULT_TEST_STAY };

      const messages = snap.docs.map((d) => {
        const m = d.data() as FirestoreMessage;
        const ms = m.createdAt?.toDate ? m.createdAt.toDate().getTime() : Date.now();
        return {
          id: d.id,
          content: m.content,
          senderId: m.senderId,
          createdAtMs: ms,
        };
      });
      cb({ stay: r.stay, messages });
    },
    (err) => {
      onError?.(err);
    },
  );

  return () => unsubMsgs();
}

export async function sendTestMessage(senderId: number, content: string) {
  try {
    const msgsRef = collection(db, 'chats', 'test', 'messages');
    await addDoc(msgsRef, { senderId, content, createdAt: serverTimestamp() });
    await updateDoc(doc(db, 'chats', 'test'), { lastMessage: content, updatedAt: serverTimestamp() });
  } catch (error) {
    console.error('Failed to send test message:', error);
    throw error;
  }
}

// 필요 시 테스트 채팅방을 생성/초기화
export async function ensureTestChat() {
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
