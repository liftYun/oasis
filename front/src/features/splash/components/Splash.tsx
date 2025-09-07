'use client';

import Image from 'next/image';
import { Button } from '@/components/atoms/button';
import LanguageToggle from '@/components/molecules/LanguageToggle';
import { OnboardSlider, useSplash } from '@/features/splash';
import Google from '@/assets/icons/google.png';

export function Splash({ lang }: { lang: 'ko' | 'en' }) {
  const { t, slides, handleGoogleLogin } = useSplash(lang);

  return (
    <main className="relative flex flex-col w-full px-6 py-10 text-center min-h-screen">
      <LanguageToggle label={t.tooltip} />
      <OnboardSlider slides={slides} autoPlayMs={3000} loop />

      <div className="mt-auto pb-6">
        <Button variant="google" onClick={handleGoogleLogin} className="w-full max-w-lg mx-auto">
          <Image src={Google} alt="Google" width={18} height={18} className="mr-2" />
          {t.login}
        </Button>
      </div>
    </main>
  );
}
