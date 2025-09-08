'use client';

import { Button } from '@/components/atoms/Button';
import { useRegisterStore, registerMessages } from '@/features/register';
import { useLanguage } from '@/features/language';

export function RegisterRole() {
  const { nickname, setNickname, handleSubmit } = useRegisterStore();
  const { lang } = useLanguage();
  const t = registerMessages[lang];

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
          maxLength={15}
          placeholder={t.nicknamePlaceholder}
          className="flex-1 bg-transparent py-2 text-base text-gray-600 placeholder-gray-300 focus:outline-none"
        />

        <button
          type="button"
          className="text-sm text-gray-500 px-4 py-[6px] mb-2 rounded-sm bg-gray-200 hover:bg-gray-300"
          onClick={handleSubmit}
        >
          {t.confirm}
        </button>
      </div>
      <p className="text-sm text-gray-300 mt-2">{nickname.length} / 15</p>

      <div className="mt-auto pb-6">
        <Button variant="blue" onClick={handleSubmit} className="w-full max-w-lg mx-auto">
          {t.confirm}
        </Button>
      </div>
    </main>
  );
}
