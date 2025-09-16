'use client';

import { Button } from '@/components/atoms/Button';
import { useLanguage } from '@/features/language';
import { useRegisterStore, useNicknameValidation, registerMessages } from '@/features/register';
import { useAuthStore } from '@/stores/useAuthStores';
import { useEffect } from 'react';

export function RegisterNickname() {
  const { setNickname: setStoreNickname, next } = useRegisterStore();
  const { nickname: savedNickname } = useAuthStore();
  const { nickname, setNickname, checkNickname } = useNicknameValidation(savedNickname ?? '');
  const { lang } = useLanguage();
  const t = registerMessages[lang];
  const setUser = useAuthStore((s) => s.setUser);

  const handleNicknameConfirm = async () => {
    await checkNickname();
  };

  const handleFinalConfirm = () => {
    setStoreNickname(nickname.trim());
    next();
  };

  useEffect(() => {
    const accessToken =
      'eyJhbGciOiJIUzI1NiJ9.eyJ1dWlkIjoiZjU4MTU5NGMtOWQ4YS00ZDM2LWJlM2YtMjg2ZjM1ZTE4Y2ZkIiwicHJvZmlsZVVybCI6InRlc3RHdWVzdEB0ZXN0LmNvbSIsIm5pY2tuYW1lIjoiR1VFU1QiLCJyb2xlIjoiUk9MRV9HVUVTVCIsImxhbmd1YWdlIjoiS09SIiwiaWF0IjoxNzU3ODMwNTE1LCJleHAiOjE3NjM4Nzg1MTV9.BQCs_exjLyKLWbhRNyOKItj1Gm9ix7k43DUQ8-I3drg';
    console.log('RegisterNickname.tsx', accessToken);
    setUser({ accessToken });
  }, [savedNickname]);

  return (
    <main className="flex flex-col w-full px-6 py-10 min-h-screen">
      <h1 className="text-2xl font-bold leading-relaxed text-gray-600 mb-3 whitespace-pre-line">
        {t.title}
      </h1>
      <p className="text-base text-gray-400 mb-8">{t.subtitle}</p>
      <div className="flex items-center gap-2 border-b-2 border-gray-200 focus-within:border-primary">
        <input
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          maxLength={10}
          placeholder={t.nicknamePlaceholder}
          className="flex-1 bg-transparent py-2 text-base text-gray-600 placeholder-gray-300 focus:outline-none"
        />
        <button
          type="button"
          className="text-sm text-gray-500 px-4 py-[6px] mb-2 rounded-sm bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          onClick={handleNicknameConfirm}
        >
          {t.confirm}
        </button>
      </div>
      <p className="text-sm text-gray-300 mt-1">
        <span className="text-primary">{nickname.trim().length}</span> / 10
      </p>
      <div className="mt-auto">
        <Button variant="blue" onClick={handleFinalConfirm} className="w-full max-w-lg mx-auto">
          {t.confirm}
        </Button>
      </div>
    </main>
  );
}
