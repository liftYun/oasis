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
  getDoc,
  updateDoc,
  increment,
  writeBatch,
  serverTimestamp,
  type Firestore,
  type FieldValue,
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
  lastSenderUid?: string; // 누가 마지막 메시지를 보냈는지 식별
  createdAt?: { toDate(): Date };
  updatedAt?: { toDate(): Date };
  // optional unread metadata (for UI only)
  unreadCounts?: Record<string, number>;
  lastReadAt?: Record<string, { toDate(): Date }>;
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
  const roomRef = doc(db, 'chats', chatId);

  // 배치 시작: 메시지 생성 + 방 메타 업데이트 + 미읽음 카운트 증가를 하나의 커밋으로
  const batch = writeBatch(db);

  // 새 메시지 문서 참조(자동 ID)
  const messageDocRef = doc(messagesRef);
  batch.set(messageDocRef, {
    content: trimmed,
    senderUid,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  // 기본 메타 업데이트 데이터
  const roomUpdateData: Record<string, any> = {
    lastMessage: trimmed,
    updatedAt: serverTimestamp(),
    lastSenderUid: senderUid,
  };

  // 수신자에게만 unread 카운트 증가 (presence에 없는 사용자만 증가)
  try {
    const roomSnap = await getDoc(roomRef);
    const roomData = roomSnap.data() as FirestoreRoom | undefined;
    if (roomData) {
      const presenceRef = collection(db, 'chats', chatId, 'presence');
      const presenceSnap = await getDocs(presenceRef);
      const onlineUserIds = new Set(presenceSnap.docs.map((d) => d.id));

      for (const uid of roomData.memberIds ?? []) {
        if (uid === senderUid) continue;
        if (!onlineUserIds.has(uid)) {
          roomUpdateData[`unreadCounts.${uid}`] = increment(1);
        }
      }
    }
  } catch (e) {
    // presence/room 조회 실패 시에도 메시지와 기본 메타 업데이트는 진행
    console.error('[chat] failed to prepare unreadCounts updates:', e);
  }

  batch.update(roomRef, roomUpdateData);
  await batch.commit();
}

// 사용자가 방에 들어와 내용을 확인한 시점 기록 및 카운트 초기화
export async function markChatAsRead(chatId: string, userUid: string): Promise<void> {
  const db = getDb();
  if (!db) throw new Error('Firestore is not configured');
  const roomRef = doc(db, 'chats', chatId);
  // 멤버십 검증: 방 구성원이 아닌 경우 메타 갱신 불가
  const snap = await getDoc(roomRef);
  const room = snap.data() as FirestoreRoom | undefined;
  if (!room?.memberIds?.includes(userUid)) {
    throw new Error('User is not a member of this chat');
  }
  await updateDoc(roomRef, {
    [`lastReadAt.${userUid}`]: serverTimestamp(),
    [`unreadCounts.${userUid}`]: 0,
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
