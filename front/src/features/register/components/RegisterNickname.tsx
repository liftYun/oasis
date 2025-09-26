'use client';

import { Button } from '@/components/atoms/Button';
import { useLanguage } from '@/features/language';
import { useRegisterStore, useNicknameValidation, registerMessages } from '@/features/register';
import { useAuthStore } from '@/stores/useAuthStores';

export function RegisterNickname() {
  const { setNickname: setStoreNickname, next } = useRegisterStore();
  const { nickname: savedNickname } = useAuthStore();
  const { nickname, setNickname, checkNickname, isValid, checking } = useNicknameValidation(
    savedNickname ?? ''
  );
  const { lang } = useLanguage();
  const t = registerMessages[lang];
  const setUser = useAuthStore((s) => s.setUser);

  const handleNicknameConfirm = async () => {
    await checkNickname();
  };

  const handleFinalConfirm = () => {
    if (!isValid) return;
    setStoreNickname(nickname.trim());
    next();
  };

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
          disabled={checking}
          className={`w-full text-center text-sm px-4 py-[6px] mb-2 rounded-sm whitespace-nowrap ${
            isValid
              ? 'bg-primary text-white'
              : 'bg-gray-200 text-gray-500 hover:bg-gray-300 disabled:opacity-50'
          }`}
          onClick={handleNicknameConfirm}
        >
          {checking ? t.confirmIng : t.confirm}
        </button>
      </div>

      <p className="text-sm text-gray-300 mt-1">
        <span className="text-primary">{nickname.trim().length}</span> / 10
      </p>

      <div className="mt-auto">
        <Button
          variant={isValid ? 'blue' : 'blueLight'}
          disabled={!isValid}
          onClick={handleFinalConfirm}
          className="w-full max-w-lg mx-auto"
        >
          {t.confirm}
        </Button>
      </div>
    </main>
  );
}
