'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation';
import { useLanguage } from '@/features/language/hooks/useLanguage';
import { updateLanguage } from '@/services/user.api';
import EnDark from '@/assets/icons/en-dark.png';
import EnLight from '@/assets/icons/en-light.png';
import KoDark from '@/assets/icons/ko-dark.png';
import KoLight from '@/assets/icons/ko-light.png';
import BackHeader from '@/components/molecules/BackHeader';

export function Language() {
  const { changeLang } = useLanguage();
  const searchParams = useSearchParams();
  const router = useRouter();
  const from = searchParams.get('from') || '';

  const isFromProfile = from === 'myprofile';
  const targetPath = isFromProfile ? '/my-profile/detail' : '/register';

  const cardClass = () =>
    'group block rounded-2xl px-5 py-10 transition focus-visible:outline-none bg-gray-100 text-gray-500 hover:bg-gray-500 hover:text-white';

  const handleChange = async (lang: 'kor' | 'eng') => {
    try {
      changeLang(lang);

      if (isFromProfile) {
        await updateLanguage(lang.toUpperCase());
        // myprofile에서만 새로고침
        window.location.reload();
      }
    } catch (err) {
      console.error('언어 변경 실패:', err);
    }
  };

  return (
    <main className="relative flex flex-col w-full mx-0 px-6 py-10 min-h-screen">
      {isFromProfile && <BackHeader title="언어 선택" />}

      <h1
        className={`text-2xl font-bold text-gray-500 leading-relaxed ${
          isFromProfile ? 'pt-6' : ''
        }`}
      >
        사용 언어를 선택해주세요. <br /> Please select a language.
      </h1>

      <div className="mt-20 flex flex-col gap-6">
        <Link
          href={targetPath}
          prefetch
          className={cardClass()}
          onClick={() => handleChange('kor')}
        >
          <div className="flex justify-between gap-3 w-full max-w-lg mx-auto">
            <div>
              <div className="text-xl font-semibold">한국어</div>
              <div className="text-sm opacity-80 mt-1">한국어로 서비스 이용하기</div>
            </div>
            <div className="relative w-20 h-20 group">
              <Image
                src={KoDark}
                alt="Korean Dark Icon"
                fill
                priority
                className="group-hover:hidden group-active:hidden group-focus:hidden"
              />
              <Image
                src={KoLight}
                alt="Korean Light Icon"
                fill
                priority
                className="hidden group-hover:block group-active:block group-focus:block"
              />
            </div>
          </div>
        </Link>

        <Link
          href={targetPath}
          prefetch
          className={cardClass()}
          onClick={() => handleChange('eng')}
        >
          <div className="flex justify-between gap-3 w-full max-w-lg mx-auto">
            <div>
              <div className="text-xl font-semibold">English</div>
              <div className="text-sm opacity-80 mt-1">Use the service in English</div>
            </div>
            <div className="relative w-20 h-20 group">
              <Image
                src={EnDark}
                alt="English Dark Icon"
                fill
                priority
                className="group-hover:hidden group-active:hidden group-focus:hidden"
              />
              <Image
                src={EnLight}
                alt="English Light Icon"
                fill
                priority
                className="hidden group-hover:block group-active:block group-focus:block"
              />
            </div>
          </div>
        </Link>
      </div>
    </main>
  );
}
