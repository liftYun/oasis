'use client';

import { toast } from 'react-hot-toast';
import { chatMessages } from '@/features/chat/locale';
import type { Lang } from '@/types/lang';

export const TOAST_ID = {
  FIREBASE_UNAVAILABLE: 'chat-firebase-unavailable',
  FIREBASE_SEND_FAIL: 'chat-firebase-send-fail',
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
