'use client';

import { toast } from 'react-hot-toast';

export const TOAST_ID = {
  FIREBASE_UNAVAILABLE: 'chat-firebase-unavailable',
  FIREBASE_SEND_FAIL: 'chat-firebase-send-fail',
} as const;

export function notifyFirebaseUnavailable() {
  toast.error('채팅 기능을 사용할 수 없어요. 잠시 후 다시 시도해주세요.', {
    id: TOAST_ID.FIREBASE_UNAVAILABLE,
    duration: 4000,
  });
}

export function notifySendFail() {
  toast.error('메시지 전송에 실패했어요. 잠시 후 다시 시도해주세요.', {
    id: TOAST_ID.FIREBASE_SEND_FAIL,
    duration: 3000,
  });
}
