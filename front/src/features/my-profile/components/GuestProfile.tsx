'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { logout, secession } from '@/services/auth.api';
import Calendar from '@/assets/icons/calendar.png';
// import HeartPointer from '@/assets/icons/heart-pointer.png';
import Heart from '@/assets/icons/heart.png';
import PositiveReview from '@/assets/icons/positive-review.png';
import SignOut from '@/assets/icons/sign-out.png';
// import Secession from '@/assets/icons/secession.png';
import Usdc from '@/assets/icons/usd-circle.png';
import { useLanguage } from '@/features/language';
import { profileMessages } from '@/features/my-profile';

export function GuestProfile() {
  const { lang } = useLanguage();
  const t = profileMessages[lang];
  const router = useRouter();

  const handleProfile = () => {
    router.push('/my-profile/detail');
  };

  const handleLogout = async () => {
    try {
      await logout();
      alert('로그아웃 되었습니다.');
      window.location.href = '/';
    } catch (err) {
      console.error(err);
      alert('로그아웃 중 오류가 발생했습니다.');
    }
  };

  // const handleSecession = async () => {
  //   if (!confirm('정말 회원 탈퇴하시겠습니까?')) return;
  //   try {
  //     await secession();
  //     alert('회원 탈퇴가 완료되었습니다.');
  //     window.location.href = '/';
  //   } catch (err) {
  //     console.error(err);
  //     alert('회원 탈퇴 중 오류가 발생했습니다.');
  //   }
  // };

  return (
    <div
      className="flex flex-col items-center px-6 py-8 space-y-6 min-h-screen overflow-y-auto"
      style={{ paddingBottom: 'var(--safe-bottom, 110px)' }}
    >
      <section
        onClick={handleProfile}
        className="flex flex-col items-center space-y-2 cursor-pointer"
      >
        <div className="w-20 h-20 rounded-full bg-gray-200" />
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-600">
            {t.guest}
          </span>
          <h2 className="text-xl font-semibold">이민희</h2>
        </div>
      </section>

      <div
        className="w-full max-w-sm rounded-md p-5 mb-8"
        style={{ background: 'linear-gradient(to right, #dbeafe, #e0f2f1)' }}
      >
        <div className="flex items-center gap-2 mb-3">
          <Image src={Usdc} alt="USDC Icon" width={15} height={15} />
          <span className="text-sm text-gray-800 font-medium">{t.usdc}</span>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-2xl font-bold text-gray-900">19.0</p>
          <button className="px-4 py-1.5 rounded-full bg-white font-semibold flex items-center justify-center">
            <span className="text-xs text-transparent bg-clip-text bg-gradient-to-r from-[#3B87F4] to-[#88D4AF]">
              {t.balance}
            </span>
          </button>
        </div>
      </div>

      <div className="w-full max-w-sm space-y-1">
        <p className="text-sm text-gray-500 mb-2 font-bold">{t.reservation}</p>
        <Link
          href="/my-profile/reservations"
          className="flex items-center gap-4 w-full px-3 py-3 rounded-md hover:bg-gray-50 transition"
        >
          <Image src={Calendar} alt="Calendar Icon" width={24} height={24} />
          <span className="text-gray-800 text-sm">{t.reservationHistory}</span>
        </Link>
      </div>

      <div className="w-full max-w-sm space-y-1">
        <p className="text-sm text-gray-500 mb-2 font-bold">{t.activity}</p>
        <Link
          href="/my-profile/favorite"
          className="flex items-center gap-4 w-full px-3 py-3 rounded-md hover:bg-gray-50 transition"
        >
          {/* <Image src={HeartPointer} alt="Heart Pointer Icon" width={24} height={24} /> */}
          <Image src={Heart} alt="Heart Pointer Icon" width={24} height={24} />
          <span className="text-gray-800 text-sm">{t.wishlist}</span>
        </Link>
        <Link
          href="/my-profile/reviews"
          className="flex items-center gap-4 w-full px-3 py-3 rounded-md hover:bg-gray-50 transition"
        >
          <Image src={PositiveReview} alt="Positive Review Icon" width={24} height={24} />
          <span className="text-gray-800 text-sm">{t.reviews}</span>
        </Link>
      </div>

      <div className="w-full max-w-sm space-y-1">
        <p className="text-sm text-gray-500 mb-2 font-bold">{t.guide}</p>
        <button
          onClick={handleLogout}
          className="flex items-center gap-4 w-full px-3 py-3 rounded-md hover:bg-gray-50 transition"
        >
          <Image src={SignOut} alt="Sign Out Icon" width={24} height={24} />
          <span className="text-gray-800 text-sm">{t.logout}</span>
        </button>
        {/* <button
          onClick={handleSecession}
          className="flex items-center gap-4 w-full px-3 py-3 rounded-md hover:bg-gray-50 transition"
        >
          <Image src={Secession} alt="Secession Icon" width={24} height={24} />
          <span className="text-gray-800 text-sm">{t.secession}</span>
        </button> */}
      </div>
    </div>
  );
}
