'use client';

import { getDb } from '@/lib/firebase/client';
import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  deleteDoc,
  serverTimestamp,
} from 'firebase/firestore';

export function subscribeChatPresence(
  chatId: string,
  cb: (userIds: string[]) => void,
  onError?: (error: unknown) => void
) {
  const db = getDb();
  if (!db) {
    onError?.(new Error('Firestore is not configured'));
    return () => {};
  }
  const ref = collection(db, 'chats', chatId, 'presence');
  const unsub = onSnapshot(
    ref,
    (snap) => {
      const users = snap.docs.map((d) => d.id);
      cb(users);
    },
    onError
  );
  return unsub;
}

export async function enterChatRoom(chatId: string, userUid: string): Promise<void> {
  const db = getDb();
  if (!db) throw new Error('Firestore is not configured');
  const ref = doc(db, 'chats', chatId, 'presence', userUid);
  await setDoc(
    ref,
    {
      status: 'online',
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}

export async function exitChatRoom(chatId: string, userUid: string): Promise<void> {
  const db = getDb();
  if (!db) throw new Error('Firestore is not configured');
  const ref = doc(db, 'chats', chatId, 'presence', userUid);
  await deleteDoc(ref);
}
