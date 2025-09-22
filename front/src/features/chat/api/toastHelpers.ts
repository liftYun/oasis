'use client';

import { toast } from 'react-hot-toast';
import { chatMessages } from '@/features/chat/locale';
import type { Lang } from '@/types/lang';

export const TOAST_ID = {
  FIREBASE_UNAVAILABLE: 'chat-firebase-unavailable',
  FIREBASE_SEND_FAIL: 'chat-firebase-send-fail',
  CHAT_MESSAGE_TOO_LONG: 'chat-message-too-long',
} as const;

export function notifyFirebaseUnavailable(lang: Lang) {
  const t = chatMessages[lang];
  toast.error(t.toastUnavailable, {
    id: TOAST_ID.FIREBASE_UNAVAILABLE,
    duration: 4000,
  });
}

export function notifySendFail(lang: Lang) {
  const t = chatMessages[lang];
  toast.error(t.toastSendFail, {
    id: TOAST_ID.FIREBASE_SEND_FAIL,
    duration: 3000,
  });
}

export function notifyTooLong(lang: Lang) {
  const t = chatMessages[lang];
  toast.error(t.toastTooLong, {
    id: TOAST_ID.CHAT_MESSAGE_TOO_LONG,
    duration: 2500,
  });
}
