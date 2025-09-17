'use client';
import { getApps, initializeApp, type FirebaseApp } from 'firebase/app';
import { getFirestore, type Firestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

type InitResult = { ok: true; app: FirebaseApp; db: Firestore } | { ok: false; error: Error };

let cachedInit: InitResult | undefined;

function initializeFirebase(): InitResult {
  // 필수 환경변수 검증 (measurementId는 선택)
  const requiredFields = [
    'apiKey',
    'authDomain',
    'projectId',
    'storageBucket',
    'messagingSenderId',
    'appId',
  ] as const;
  const missing = requiredFields.filter((field) => !firebaseConfig[field]);
  if (missing.length > 0) {
    const err = new Error(`Missing required Firebase environment variables: ${missing.join(', ')}`);
    if (process.env.NODE_ENV !== 'production') {
      console.error(err);
    }
    return { ok: false, error: err };
  }

  try {
    const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
    const db = getFirestore(app);
    return { ok: true, app, db };
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Failed to initialize Firebase:', error);
    }
    return {
      ok: false,
      error: new Error('Firebase initialization failed. Please check your configuration.'),
    };
  }
}

export function getDb(): Firestore | null {
  if (!cachedInit) cachedInit = initializeFirebase();
  return cachedInit.ok ? cachedInit.db : null;
}

export function getFirebaseInitError(): Error | null {
  if (!cachedInit) cachedInit = initializeFirebase();
  return cachedInit.ok ? null : cachedInit.error;
}
