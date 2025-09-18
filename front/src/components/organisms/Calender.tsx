'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import type { DateRange } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { differenceInDays, format } from 'date-fns';
import Calender from '@/assets/icons/calender.png';
import { useLanguage } from '@/features/language';
import CalendarBase from '@/components/organisms/CalendarBase';

interface Props {
  value?: DateRange;
  onChange?: (range: DateRange | undefined) => void;
}

export default function Calendar({ value, onChange }: Props) {
  const [range, setRange] = useState<DateRange | undefined>(value);
  const { lang } = useLanguage();

  useEffect(() => {
    setRange(value);
  }, [value]);

  const nights = range?.from && range?.to ? differenceInDays(range.to, range.from) : 0;

  const labels = {
    kor: {
      placeholder: '날짜를 선택하세요',
      nights: (n: number) => `${n}박`,
    },
    eng: {
      placeholder: 'Select a date',
      nights: (n: number) => `${n} nights`,
    },
  } as const;

  const handleSelect = (newRange: DateRange | undefined) => {
    setRange(newRange);
    onChange?.(newRange);
  };

  return (
    <div className="bg-white rounded-xl shadow-[0_0_10px_rgba(0,0,0,0.1)] p-6 mt-10">
      <div className="mb-4 px-4 py-4 rounded-full bg-gray-50 flex items-center text-sm text-gray-600 gap-3">
        <Image src={Calender} alt="calendar icon" width={14} height={14} className="mx-2" />
        {range?.from && range?.to ? (
          <>
            {format(range.from, 'yy.MM.dd')} ~ {format(range.to, 'yy.MM.dd')} (
            {labels[lang].nights(nights)})
          </>
        ) : (
          labels[lang].placeholder
        )}
      </div>

      <CalendarBase
        mode="singleRange"
        theme="blue"
        selected={range}
        onChange={handleSelect}
        className="mx-auto flex justify-center"
      />
    </div>
  );
}
