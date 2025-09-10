'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/atoms/Button';
import CalendarSheet from '@/components/organisms/CalendarSheet';
import CalenderIcon from '@/assets/icons/calender.png';

export function Step4_Availability() {
  const [open, setOpen] = useState(false);

  const readOnlyInputClassName =
    'flex h-12 w-full cursor-pointer items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-base placeholder:text-sm placeholder:text-gray-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50';

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-bold mb-1">숙소 예약 불가능 날짜를 선택해주세요.</h1>
        <p className="text-gray-400 text-sm">업로드·삭제로 예약 일정이 자동 관리됩니다.</p>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-600">예약 불가 날짜</label>
        <div
          role="button"
          tabIndex={0}
          aria-label="달력 열기"
          onClick={() => setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setOpen(true);
            }
          }}
          className={`${readOnlyInputClassName} text-gray-300 text-sm relative`}
        >
          예약 불가능한 날짜를 전부 선택해주세요.
          <Image
            src={CalenderIcon}
            alt="calendar"
            width={18}
            height={18}
            className="absolute right-3"
          />
        </div>
      </div>

      <CalendarSheet open={open} onClose={() => setOpen(false)} />
    </div>
  );
}
