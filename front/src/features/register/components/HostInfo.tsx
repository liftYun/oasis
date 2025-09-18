'use client';

import React, { useCallback, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Plus, X } from 'lucide-react';
import { useLanguage } from '@/features/language';
import { registerMessages } from '@/features/register';
import { Button } from '@/components/atoms/Button';

type HostInfoProps = {
  onConfirm?: (file: File | null) => void;
  defaultFile?: File | null;
};

const ACCEPT = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];

export function HostInfo({ onConfirm, defaultFile = null }: HostInfoProps) {
  const router = useRouter();
  const { lang } = useLanguage();
  const t = registerMessages[lang];
  const [file, setFile] = useState<File | null>(defaultFile);
  const [error, setError] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const isValid = useMemo(() => !!file && !error, [file, error]);

  const isPDF = useMemo(() => file?.type === 'application/pdf', [file]);
  const previewURL = useMemo(
    () => (file && !isPDF ? URL.createObjectURL(file) : ''),
    [file, isPDF]
  );

  const validate = (f: File) => {
    if (!f) return '파일을 선택해주세요.';

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    const valid = allowedTypes.includes(f.type);

    if (!valid) return t.errorPdf;
    if (f.size > 10 * 1024 * 1024) return t.limtedPdf;

    return '';
  };

  const handleFiles = useCallback((files?: FileList | null) => {
    const f = files?.[0];
    if (!f) return;
    const msg = validate(f);
    setError(msg);
    if (!msg) setFile(f);
  }, []);

  const openPicker = () => inputRef.current?.click();

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFiles(e.dataTransfer?.files);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const clearFile = () => {
    setFile(null);
    setError('');
    if (inputRef.current) inputRef.current.value = '';
  };

  const handleSubmit = () => {
    if (!isValid) return;
    onConfirm?.(file ?? null);
    router.push('/register/host/money');
  };

  return (
    <main className="flex flex-col w-full px-6 py-10 min-h-screen">
      <h1 className="text-2xl font-bold leading-relaxed text-gray-600 mb-3 whitespace-pre-line">
        {t.hostTitle}
      </h1>
      <p className="text-base text-gray-400 mb-8">{t.hostSubtitle}</p>

      <section className="mt-6">
        <div
          role="button"
          tabIndex={0}
          onClick={openPicker}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && openPicker()}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          className={[
            'relative mx-auto w-full max-w-xs',
            'rounded-2xl transition',
            isDragging ? 'ring-2 ring-primary/60 ring-offset-2' : '',
          ].join(' ')}
        >
          <div
            className={[
              'aspect-square rounded-2xl',
              'bg-gray-100',
              'flex items-center justify-center',
              'overflow-hidden',
              isDragging ? 'opacity-90' : '',
            ].join(' ')}
          >
            {!file && (
              <div className="flex flex-col items-center justify-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200">
                  <Plus className="h-6 w-6 text-gray-500" />
                </div>
                <div className="text-sm text-gray-500">{t.hostImage}</div>
                <div className="text-[11px] text-gray-400">{t.hostImageGuide}</div>
              </div>
            )}

            {!!file && (
              <div className="relative h-full w-full">
                {isPDF ? (
                  <div className="flex h-full w-full items-center justify-center bg-white">
                    <span className="rounded-md border border-gray-200 px-3 py-1 text-xs text-gray-600">
                      {file.name}
                    </span>
                  </div>
                ) : (
                  <Image
                    src={previewURL}
                    alt="업로드 미리보기"
                    fill
                    sizes="260px"
                    className="object-contain"
                  />
                )}

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    clearFile();
                  }}
                  className="absolute right-2 top-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white"
                  aria-label="파일 제거"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}

            <input
              ref={inputRef}
              type="file"
              accept={ACCEPT.join(',')}
              className="hidden"
              onChange={(e) => handleFiles(e.target.files)}
            />
          </div>
        </div>

        {error && <p className="mx-auto mt-3 max-w-xs text-center text-sm text-red-500">{error}</p>}
      </section>

      <div className="mt-auto">
        <Button
          variant={isValid ? 'default' : 'defaultLight'}
          disabled={!isValid}
          onClick={handleSubmit}
          className="w-full max-w-lg mx-auto"
        >
          {t.confirm}
        </Button>
      </div>
    </main>
  );
}
