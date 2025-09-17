'use client';

import Image from 'next/image';
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/atoms/Button';
import { useRegisterStore, registerMessages } from '@/features/register';
import { useLanguage } from '@/features/language';
import PreviewUser from '@/assets/icons/preview-user.png';
import { getPresignedUrl, finalizeProfileImage } from '@/services/user.api';
import { toast } from 'react-hot-toast';

export function RegisterCheck() {
  const {
    email,
    nickname,
    profileUrl,
    setProfileUrl: setStoreProfileUrl,
    next,
  } = useRegisterStore();

  const { lang } = useLanguage();
  const t = registerMessages[lang];

  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const onSelectFile: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const allowed = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/avif'];
    if (!allowed.includes(f.type)) {
      toast.error(t.errorImage);
      return;
    }
    setStoreProfileUrl(f);
  };

  useEffect(() => {
    if (!profileUrl) {
      setPreview(null);
      return;
    }

    if (profileUrl instanceof File) {
      const url = URL.createObjectURL(profileUrl);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    }

    if (typeof profileUrl === 'string') {
      setPreview(profileUrl);
    }
  }, [profileUrl]);

  const handleFinalConfirm = async () => {
    try {
      setLoading(true);

      if (profileUrl instanceof File) {
        const [type, subtype] = profileUrl.type.split('/');

        // 1. S3 업로드 URL 구하기
        const presigned = await getPresignedUrl(type, subtype);
        const { uploadUrl, key } = presigned.result;
        const fileName = key.split('/').pop()!;
        console.log(presigned);

        // 2. S3 PUT 업로드
        await axios.put(uploadUrl, profileUrl, {
          headers: { 'Content-Type': profileUrl.type },
        });

        // 3. DB 반영
        const finalized = await finalizeProfileImage(fileName);
        console.log(finalized);
        const imageUrl = finalized.result.profileImgUrl;

        // 4. store에 최종 URL 저장 (string으로 대체)
        setStoreProfileUrl(imageUrl);
      }

      // 5. 다음 단계 이동
      next();
    } catch (e) {
      toast.error(t.errorProfile);
    } finally {
      setLoading(false);
    }
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
          role="button"
          tabIndex={0}
          aria-label="프로필 이미지 업로드"
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              inputRef.current?.click();
            }
          }}
          className="relative h-24 w-24 rounded-full mb-8 bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center cursor-pointer group focus:outline-none focus:ring-2 focus:ring-blue-500"
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
        <Button
          variant="blue"
          onClick={handleFinalConfirm}
          disabled={loading}
          className="w-full max-w-lg mx-auto"
        >
          {loading ? t.confirmIng : t.confirm}
        </Button>
      </div>
    </main>
  );
}
