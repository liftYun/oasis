'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getMyProfile } from '@/services/user.api';
import { Lottie } from '@/components/atoms/Lottie';
import { useLanguage } from '@/features/language';
import { profileMessages } from '@/features/my-profile';

interface UserProfile {
  profileUrl: string;
  nickname: string;
  email: string;
  role: string;
  language: string;
}

export function Detail() {
  const { lang } = useLanguage();
  const t = profileMessages[lang];
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);

  const languageMap: Record<string, { kor: string; eng: string }> = {
    ENG: { kor: '영어', eng: 'eng' },
    KOR: { kor: '한국어', eng: 'kor' },
  };

  const roleMap: Record<string, { kor: string; eng: string }> = {
    ROLE_GUEST: { kor: '게스트', eng: 'guest' },
    ROLE_HOST: { kor: '호스트', eng: 'host' },
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getMyProfile();
        setUser(data.result);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProfile();
  }, []);

  const goLanguage = () => {
    router.push('/language?from=myprofile');
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <Lottie src="/lotties/spinner.json" className="w-20 h-20" />
        <p className="text-sm text-gray-500">{t.loading}</p>
      </div>
    );
  }

  const isKorean = user.language === 'KOR';

  const displayLanguage = isKorean
    ? languageMap[user.language]?.kor
    : languageMap[user.language]?.eng;

  const displayRole = isKorean ? roleMap[user.role]?.kor : roleMap[user.role]?.eng;

  return (
    <div className="flex flex-col items-center min-h-screen">
      <section className="flex flex-col items-center mt-10 mb-6">
        <img
          src={user.profileUrl}
          alt="프로필 이미지"
          className="w-20 h-20 rounded-full object-cover mb-4"
        />
        <h2 className="text-xl font-semibold">{user.nickname}</h2>
      </section>

      <div className="w-full max-w-md h-3 bg-gray-100 my-6" />

      <section className="w-full max-w-md px-6 py-5 space-y-4">
        <h3 className="text-lg text-gray-600 font-semibold mb-6">{t.detail}</h3>

        <div className="space-y-5 text-base">
          <InfoRow label={t.nickname} value={user.nickname} />
          <InfoRow label={t.email} value={user.email} />
          <InfoRow label={t.role} value={displayRole} />
          <div className="flex items-center justify-between">
            <span className="text-gray-300">{t.language}</span>
            <div className="flex items-center gap-3">
              <span>{displayLanguage}</span>
              <button
                onClick={goLanguage}
                className="text-blue-500 text-xs bg-blue-50 rounded-full py-1 px-2"
              >
                {t.edit}
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-gray-300">{label}</span>
      <span>{value}</span>
    </div>
  );
}
