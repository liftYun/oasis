'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { DateRange, DayPicker, getDefaultClassNames } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { ko } from 'date-fns/locale';
import { differenceInDays, format } from 'date-fns';
import { Lang } from '@/types';
import Calender from '@/assets/icons/calender.png';

function normalizeLang(v: unknown): Lang {
  return v === 'eng' ? 'eng' : 'kor';
}

export default function Calendar() {
  const [range, setRange] = useState<DateRange | undefined>(undefined);
  const nights = range?.from && range?.to ? differenceInDays(range.to, range.from) : 0;
  const [lang, setLang] = useState<Lang>('kor');
  const defaultClassNames = getDefaultClassNames();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const raw = localStorage.getItem('app_lang');
      setLang(normalizeLang(raw));
    }
  }, []);

  const labels: Record<Lang, { placeholder: string; nights: (n: number) => string }> = {
    kor: {
      placeholder: '날짜를 선택하세요',
      nights: (n) => `${n}박`,
    },
    eng: {
      placeholder: 'Select a date',
      nights: (n) => `${n} nights`,
    },
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

      <DayPicker
        mode="range"
        selected={range}
        onSelect={setRange}
        locale={lang === 'kor' ? ko : undefined}
        showOutsideDays
        fixedWeeks
        classNames={{
          day: 'text-gray-600',
          today: 'text-primary font-bold',
          chevron: 'fill-primary',
        }}
        modifiersClassNames={{
          range_middle: 'bg-blue-100 text-gray-600 rounded-full',
          range_start: 'bg-primary text-white rounded-full',
          range_end: 'bg-primary text-white rounded-full',
          selected: 'bg-primary text-gray-600',
        }}
        styles={{
          day: { margin: 0, width: '36px', height: '36px' },
        }}
        navLayout="around"
        className="mx-auto flex justify-center"
      />
    </div>
  );
}
