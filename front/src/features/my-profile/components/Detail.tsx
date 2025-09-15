'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getMyProfile } from '@/services/user.api';
import { Lottie } from '@/components/atoms/Lottie';

interface UserProfile {
  nickname: string;
  email: string;
  role: string;
  language: string;
}

export function Detail() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getMyProfile();
        setUser(data);
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
        <p className="text-sm text-gray-500">로딩 중...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center min-h-screen">
      <section className="flex flex-col items-center mt-10 mb-6">
        <div className="w-20 h-20 rounded-full bg-gray-200 mb-4" />
        <h2 className="text-xl font-semibold">{user.nickname}</h2>
      </section>

      <div className="w-full max-w-md h-3 bg-gray-100 my-6" />

      <section className="w-full max-w-md px-6 py-5 space-y-4">
        <h3 className="text-lg text-gray-600 font-semibold mb-6">기본정보</h3>

        <div className="space-y-5 text-base">
          <InfoRow label="닉네임" value={user.nickname} />
          <InfoRow label="이메일 주소" value={user.email} />
          <InfoRow label="권한" value={user.role} />
          <div className="flex items-center justify-between">
            <span className="text-gray-300">사용 언어</span>
            <div className="flex items-center gap-3">
              <span>{user.language}</span>
              <button
                onClick={goLanguage}
                className="text-blue-500 text-xs bg-blue-50 rounded-full py-1 px-2"
              >
                수정
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
