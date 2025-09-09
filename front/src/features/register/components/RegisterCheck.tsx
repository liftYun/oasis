'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/atoms/Button';
import { useRegisterStore, registerMessages } from '@/features/register';
import { useLanguage } from '@/features/language';
import PreviewUser from '@/assets/icons/preview-user.png';

export function RegisterCheck() {
  const {
    email,
    nickname,
    profileImage,
    setProfileImage: setStoreProfileImage,
    next,
  } = useRegisterStore();
  const { lang } = useLanguage();
  const t = registerMessages[lang];

  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const onSelectFile: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!f.type.startsWith('image/')) {
      alert('이미지 파일만 업로드할 수 있어요.');
      return;
    }
    setStoreProfileImage?.(f);
  };

  useEffect(() => {
    if (!profileImage) {
      setPreview(null);
      return;
    }
    if (profileImage instanceof File) {
      const url = URL.createObjectURL(profileImage);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    }
    setPreview(profileImage as string);
  }, [profileImage]);

  const handleFinalConfirm = () => {
    next();
  };

  const hasPreview = Boolean(preview);

  return (
    <main className="flex flex-col w-full px-6 py-10 min-h-screen">
      <h1 className="text-2xl font-bold leading-relaxed text-gray-600 mb-3 whitespace-pre-line">
        {t.checkTitle}
      </h1>
      <p className="text-base text-gray-400 mb-8">{t.subtitle}</p>

      <div className="relative mx-auto">
        <div
          onClick={() => inputRef.current?.click()}
          className="relative h-24 w-24 rounded-full mb-8 bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center cursor-pointer group"
          aria-label={hasPreview ? t.imageLabelAfter : t.imageLabelBefore}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click();
          }}
        >
          {hasPreview ? (
            <img src={preview!} alt="Profile preview" className="h-full w-full object-cover" />
          ) : (
            <Image
              src={PreviewUser}
              alt="기본 프로필"
              className="h-24 w-24 object-contain text-gray-300"
            />
          )}

          <div className="absolute inset-0 rounded-full bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 text-white text-xs">
            {hasPreview ? t.imageLabelAfter : t.imageLabelBefore}
          </div>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onSelectFile}
        />
      </div>

      <section className="flex flex-col">
        <label className="block text-sm mb-2 text-gray-300">{t.emailLabel}</label>
        <div className="flex items-center gap-2 border-b-2 mb-8 border-gray-200">
          <input
            value={email ?? ''}
            readOnly
            className="flex-1 bg-transparent py-2 text-base text-gray-600 placeholder-gray-300 focus:outline-none cursor-default"
          />
        </div>

        <label className="block text-sm mb-2 text-gray-300">{t.nicknamePlaceholder}</label>
        <div className="flex items-center gap-2 border-b-2 border-gray-200">
          <input
            value={nickname ?? ''}
            readOnly
            className="flex-1 bg-transparent py-2 text-base text-gray-600 placeholder-gray-300 focus:outline-none cursor-default"
          />
        </div>
      </section>

      <div className="mt-auto">
        <Button variant="blue" onClick={handleFinalConfirm} className="w-full max-w-lg mx-auto">
          {t.confirm}
        </Button>
      </div>
    </main>
  );
}
