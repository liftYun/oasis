'use client';

import Image from 'next/image';
import { Button } from '@/components/atoms/Button';
import LanguageToggle from '@/components/molecules/LanguageToggle';
import { OnboardSlider, useSplash } from '@/features/splash';
import Google from '@/assets/icons/google.png';
import { useState, useRef } from 'react';

export function Splash({ lang }: { lang: 'ko' | 'en' }) {
  const { t, slides, handleGoogleLogin } = useSplash(lang);
  const [index, setIndex] = useState(0);
  const goRef = useRef<(i: number, dir: number) => void>();

  return (
    <main className="relative flex flex-col w-full px-6 py-10 text-center min-h-screen">
      <LanguageToggle label={t.tooltip} />

      <OnboardSlider
        slides={slides}
        autoPlayMs={3000}
        loop
        onChange={(i, go) => {
          setIndex(i);
          goRef.current = go;
        }}
      />

      <div className="mt-auto flex flex-col items-center gap-10">
        <div className="flex justify-center gap-2">
          {slides.map((_, i) => {
            const active = i === index;
            return (
              <button
                key={i}
                aria-label={`Go to slide ${i + 1}`}
                aria-current={active ? 'true' : undefined}
                onClick={() => goRef.current?.(i, i > index ? 1 : -1)}
                className={`h-2 rounded-full transition
              ${active ? 'bg-gray-600 w-6' : 'bg-gray-300 w-2 hover:bg-gray-400 hover:scale-110'}
            `}
              />
            );
          })}
        </div>

        <Button variant="google" onClick={handleGoogleLogin} className="w-full max-w-lg mx-auto">
          <Image src={Google} alt="Google" width={18} height={18} className="mr-2" />
          {t.login}
        </Button>
      </div>
    </main>
  );
}
