'use client';

import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/atoms/button';
import LanguageToggle from '@/components/molecules/LanguageToggle';
import OnboardSlider from '@/components/organisms/OnboardSlider';
import { Slide } from '@/types/slider';
import Google from '@/assets/icons/google.png';

type Lang = 'ko' | 'en';

const dict = {
  ko: {
    tooltip: 'Change your language!',
    login: '구글 계정으로 로그인',
  },
  en: {
    tooltip: '사용 언어를 바꿔보세요!',
    login: 'Sign in with Google',
  },
} as const;

export default function SplashPage() {
  const sp = useSearchParams();
  const lang = (sp.get('lang') === 'en' ? 'en' : 'ko') as Lang;
  const t = dict[lang];

  const handleGoogleLogin = async () => {
    alert(`${t.login}`);
  };

  const slides: Slide[] = [
    {
      title: lang === 'ko' ? '블록체인 기반 신뢰' : 'Blockchain-based trust',
      desc:
        lang === 'ko'
          ? '중간 수수료 없이 \n 투명하고 안전하게 예약할 수 있어요.'
          : 'Book transparently and securely, \n with no intermediary fees.',
    },
    {
      title: lang === 'ko' ? '스마트 체크인' : 'Smart check-in',
      desc:
        lang === 'ko'
          ? '디지털 키 하나로 \n 빠르고 편리하게 입실할 수 있어요.'
          : 'You can enter quickly and conveniently \n with just one digital key.',
    },
    {
      title: lang === 'ko' ? '맞춤형 숙소 찾기' : 'Personalized stays',
      desc:
        lang === 'ko'
          ? '나에게 딱 맞는 숙소를 \n 빠르게 찾을 수 있어요.'
          : 'You can quickly find \n the perfect accommodation for you.',
    },
  ];

  return (
    <main className="relative flex flex-col w-full mx-0 px-6 py-10 text-center min-h-screen border-x border-gray-200">
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
