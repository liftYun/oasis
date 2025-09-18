'use client';

import Image from 'next/image';
import type { DateRange } from 'react-day-picker';
import { addDays, differenceInDays, format, startOfToday } from 'date-fns';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { ko } from 'date-fns/locale';
import CalenderIcon from '@/assets/icons/calender.png';
import { Button } from '@/components/atoms/Button';
import { useLanguage } from '@/features/language';
import { reservationMessages } from '@/features/reservation/locale';
import { useReservationStore } from '@/features/reservation/store';

export function Step1_Dates() {
  const { lang } = useLanguage();
  const t = reservationMessages[lang];
  const { dateRange, setDateRange, setStep } = useReservationStore();

  const nights =
    dateRange?.from && dateRange?.to ? differenceInDays(dateRange.to, dateRange.from) : 0;

  const handleSelect = (r: DateRange | undefined) => {
    if (!r?.from || !r?.to) {
      setDateRange(r);
      return;
    }
    // 박수 기준 제약: 최소 1박, 최대 29박 (= 최대 30일)
    const nightsCount = differenceInDays(r.to, r.from);
    let final = r;
    if (nightsCount < 1) {
      final = { from: r.from, to: addDays(r.from, 1) };
    } else if (nightsCount > 29) {
      final = { from: r.from, to: addDays(r.from, 29) };
    }
    setDateRange(final);
  };

  const canNext = Boolean(dateRange?.from && dateRange?.to && nights >= 1);

  const handleDayClick = (date: Date) => {
    if (!dateRange?.from || !dateRange?.to) return;
    const isStart = dateRange.from && date.toDateString() === dateRange.from.toDateString();
    const isEnd = dateRange.to && date.toDateString() === dateRange.to.toDateString();
    if (isStart || isEnd) {
      setDateRange(undefined);
    }
  };

  return (
    <section className="flex flex-col flex-1 gap-4">
      <div className="px-4 py-4 rounded-full bg-gray-50 flex items-center text-sm text-gray-600 gap-3">
        <Image src={CalenderIcon} alt="calendar icon" width={14} height={14} className="mx-2" />
        {dateRange?.from && dateRange?.to ? (
          <>
            {format(dateRange.from, 'yy.MM.dd')} ~ {format(dateRange.to, 'yy.MM.dd')} (
            {t.step1.nights(nights)})
          </>
        ) : (
          t.step1.datePlaceholder
        )}
      </div>

      <div className="mx-auto flex justify-center">
        <DayPicker
          mode="range"
          selected={dateRange}
          onSelect={handleSelect}
          onDayClick={handleDayClick}
          locale={lang === 'kor' ? ko : undefined}
          showOutsideDays
          fixedWeeks
          disabled={{ before: startOfToday() }}
          classNames={{
            day: 'text-gray-600',
            today: 'text-primary font-bold',
            chevron: 'fill-primary',
            caption: 'flex items-center justify-center whitespace-nowrap',
            nav: 'flex items-center gap-2 whitespace-nowrap',
          }}
          modifiersClassNames={{
            range_middle: 'bg-blue-100 text-gray-600',
            range_start: 'bg-primary text-white rounded-full',
            range_end: 'bg-primary text-white rounded-full',
            selected: 'bg-primary text-white',
          }}
          modifiersStyles={{ range_middle: { borderRadius: 0 } }}
          styles={{ day: { margin: 0, width: '36px', height: '36px' }, cell: { padding: 0 } }}
          navLayout="around"
        />
      </div>

      <div className="mt-auto pb-2">
        <Button
          variant={canNext ? 'default' : 'google'}
          onClick={() => setStep(2)}
          disabled={!canNext}
        >
          {t.step1.next}
        </Button>
      </div>
    </section>
  );
}
