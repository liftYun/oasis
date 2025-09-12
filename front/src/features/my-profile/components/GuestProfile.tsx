'use client';

import Image from 'next/image';
import Calendar from '@/assets/icons/calendar.png';
import HeartPointer from '@/assets/icons/heart-pointer.png';
import PositiveReview from '@/assets/icons/positive-review.png';
import SignOut from '@/assets/icons/sign-out.png';
import Secession from '@/assets/icons/secession.png';

export function GuestProfile() {
  return (
    <div className="flex flex-col items-center px-6 py-8 space-y-6">
      <div className="flex flex-col items-center space-y-2">
        <div className="w-20 h-20 rounded-full bg-gray-200" />
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold">이민희</h2>
          <span className="px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-600">게스트</span>
        </div>
      </div>

      <div className="w-full max-w-sm bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500">USDC</p>
            <p className="text-2xl font-bold">19.0</p>
          </div>
          <button className="px-3 py-2 rounded-md bg-white text-blue-600 text-sm font-medium shadow hover:bg-blue-50 transition">
            충전하기
          </button>
        </div>
      </div>

      <div className="h-px w-full bg-gray-200" />

      <div className="w-full max-w-sm space-y-1">
        <p className="text-sm text-gray-500 mb-2">예약 관리</p>
        <button className="flex items-center gap-3 w-full px-3 py-3 rounded-lg hover:bg-gray-50 transition">
          <Image src={Calendar} alt="Calendar Icon" width={22} height={22} />
          <span className="text-gray-800 text-sm">예약내역 확인</span>
        </button>
      </div>

      <div className="w-full max-w-sm space-y-1">
        <p className="text-sm text-gray-500 mb-2">활동 관리</p>
        <button className="flex items-center gap-3 w-full px-3 py-3 rounded-lg hover:bg-gray-50 transition">
          <Image src={HeartPointer} alt="Heart Pointer Icon" width={22} height={22} />
          <span className="text-gray-800 text-sm">내 관심 숙소</span>
        </button>
        <button className="flex items-center gap-3 w-full px-3 py-3 rounded-lg hover:bg-gray-50 transition">
          <Image src={PositiveReview} alt="Positive Review Icon" width={22} height={22} />
          <span className="text-gray-800 text-sm">내가 쓴 리뷰</span>
        </button>
      </div>

      <div className="w-full max-w-sm space-y-1">
        <p className="text-sm text-gray-500 mb-2">이용 안내</p>
        <button className="flex items-center gap-3 w-full px-3 py-3 rounded-lg hover:bg-gray-50 transition">
          <Image src={SignOut} alt="Sign Out Icon" width={22} height={22} />
          <span className="text-gray-800 text-sm">로그아웃</span>
        </button>
        <button className="flex items-center gap-3 w-full px-3 py-3 rounded-lg hover:bg-gray-50 transition">
          <Image src={Secession} alt="Secession Icon" width={22} height={22} />
          <span className="text-gray-800 text-sm">회원탈퇴</span>
        </button>
      </div>
    </div>
  );
}
