'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { logout, secession } from '@/services/auth.api';
import { CenterModal } from '@/components/organisms/CenterModel';
import Calendar from '@/assets/icons/calendar.png';
import CreateStay from '@/assets/icons/create-stay.png';
import SignOut from '@/assets/icons/sign-out.png';
import Secession from '@/assets/icons/secession.png';
import Usdc from '@/assets/icons/usd-circle.png';
import { useLanguage } from '@/features/language';
import { profileMessages } from '@/features/my-profile';
import { set } from 'zod';

export function HostProfile() {
  const { lang } = useLanguage();
  const t = profileMessages[lang];
  const [open, setOpen] = useState(false);

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

  const handleSecession = async () => {
    try {
      await secession();
      alert('회원 탈퇴가 완료되었습니다.');
      window.location.href = '/';
    } catch (err) {
      console.error(err);
      alert('회원 탈퇴 중 오류가 발생했습니다.');
    }
  };

  return (
    <div
      className="flex flex-col items-center px-6 py-8 space-y-6 min-h-screen overflow-y-auto"
      style={{ paddingBottom: 'var(--safe-bottom, 110px)' }}
    >
      <div className="flex flex-col items-center space-y-2">
        <div className="w-20 h-20 rounded-full bg-gray-200" />
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-600">
            {t.host}
          </span>
          <h2 className="text-xl font-semibold">이민희</h2>
        </div>
      </div>

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
          href="/my-profile/manage-stay"
          className="flex items-center gap-4 w-full px-3 py-3 rounded-md hover:bg-gray-50 transition"
        >
          <Image src={Calendar} alt="Calendar Icon" width={24} height={24} />
          <span className="text-gray-800 text-sm">{t.manageStay}</span>
        </Link>
        <Link
          href="/create-stay"
          className="flex items-center gap-4 w-full px-3 py-3 rounded-md hover:bg-gray-50 transition"
        >
          <Image src={CreateStay} alt="Create Stay Icon" width={24} height={24} />
          <span className="text-gray-800 text-sm">{t.createStay}</span>
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
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-4 w-full px-3 py-3 rounded-md hover:bg-gray-50 transition"
        >
          <Image src={Secession} alt="Secession Icon" width={24} height={24} />
          <span className="text-gray-800 text-sm">{t.secession}</span>
        </button>

        <CenterModal
          open={open}
          onClose={() => setOpen(false)}
          title={t.secessionTitle}
          description={t.secessionDescription}
        >
          <button
            onClick={() => setOpen(false)}
            className="px-5 py-3 rounded-md bg-gray-100 text-gray-300 text-sm font-medium"
          >
            {t.secessionCancel}
          </button>
          <button
            onClick={handleSecession}
            className="px-5 py-3 rounded-md bg-gray-600 text-white text-sm font-medium"
          >
            {t.secessionConfirm}
          </button>
        </CenterModal>
      </div>
    </div>
  );
}
