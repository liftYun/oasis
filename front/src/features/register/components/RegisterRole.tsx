'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useRegisterStore, registerMessages } from '@/features/register';
import { addInformations } from '@/services/auth.api';
import type { UserRole } from '@/services/auth.types';
import { useLanguage } from '@/features/language';
import Guest from '@/assets/images/guest.png';
import Host from '@/assets/images/host.png';
import { useShallow } from 'zustand/react/shallow';

export function RegisterRole() {
  const router = useRouter();
  const { lang } = useLanguage();
  const t = registerMessages[lang];

  const [profileImage, setProfileImage] = useRegisterStore(
    useShallow((s) => [s.profileImage, s.setProfileImage])
  );
  const [nickname, setNickname] = useRegisterStore(useShallow((s) => [s.nickname, s.setNickname]));
  const [email, setEmail] = useRegisterStore(useShallow((s) => [s.email, s.setEmail]));

  const [role, setRole] = useState<UserRole | null>(null);

  const handleSubmit = async () => {
    if (!role) {
      console.warn('역할을 선택해주세요');
      return;
    }

    await addInformations({
      nickname,
      role,
      language: lang,
      profileImgKey: profileImage,
    });
  };

  const cardClass = () =>
    'group relative block rounded-2xl transition focus-visible:outline-none bg-gray-100 text-gray-500 hover:bg-primary hover:text-white cursor-pointer overflow-hidden';

  const goGuest = () => {
    setRole('ROLE_GUEST');
    router.push('/main');
  };

  const goHost = () => {
    setRole('ROLE_HOST');
    router.push('/register/host');
  };

  return (
    <main className="flex flex-col w-full px-6 py-10 min-h-screen">
      <h1 className="text-2xl font-bold leading-relaxed text-gray-600 mb-3 whitespace-pre-line">
        {t.roleTitle}
      </h1>
      <p className="text-base text-gray-400 mb-2">{t.roleSubtitle}</p>

      <div className="mt-20 flex flex-col gap-6">
        <div className={cardClass()} onClick={goGuest}>
          <div className="px-5 py-10 pr-28">
            <div className="text-xl font-semibold">{t.guestRole}</div>
            <div className="text-sm opacity-80 mt-1 mb-4">{t.guestDescription}</div>
          </div>
          <div className="absolute bottom-0 right-0 pr-5 pb-0 pointer-events-none">
            <Image src={Guest} alt="Guest Icon" width={110} height={110} />
          </div>
        </div>

        <div className={cardClass()} onClick={goHost}>
          <div className="px-5 py-10 pr-28">
            <div className="text-xl font-semibold">{t.hostRole}</div>
            <div className="text-sm opacity-80 mt-1 mb-4 whitespace-pre-line">
              {t.hostDescription}
            </div>
          </div>
          <div className="absolute bottom-0 right-0 pr-5 pb-0 pointer-events-none">
            <Image src={Host} alt="Host Icon" width={100} height={100} />
          </div>
        </div>
      </div>
    </main>
  );
}
